import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();
    console.log(`Processing password reset email for: ${email}`);

    if (!email || !resetLink) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email and resetLink" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error("Missing SMTP configuration:", { 
        hasHost: !!smtpHost, 
        hasUser: !!smtpUser, 
        hasPassword: !!smtpPassword 
      });
      return new Response(
        JSON.stringify({ error: "Email configuration is incomplete" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Connecting to SMTP: ${smtpHost}:${smtpPort}`);

    // Create nodemailer transporter with proper TLS settings for IONOS
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465 (SSL/TLS), false for 587 (STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .expiry-notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; font-size: 14px; border-radius: 0 4px 4px 0; }
          .link-fallback { word-break: break-all; color: #8B5CF6; font-size: 13px; background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; padding: 20px 0; }
          .footer a { color: #8B5CF6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>TPEC Events Account</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for your TPEC Events account associated with <strong>${email}</strong>.</p>
            
            <p style="text-align: center;">
              <a href="${resetLink}" class="reset-button" style="color: white;">Reset Your Password</a>
            </p>
            
            <div class="expiry-notice">
              <strong>⏰ This link expires in 1 hour.</strong><br>
              If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <div class="link-fallback">${resetLink}</div>
            
            <p>Need help? Contact us at <a href="mailto:info@tpecflowers.com" style="color: #8B5CF6;">info@tpecflowers.com</a> or call <strong>+234 9053065636</strong>.</p>
            
            <div class="footer">
              <p><strong>TPEC Events</strong> - Creating Memorable Experiences</p>
              <p>Lagos, Nigeria</p>
              <p><a href="mailto:info@tpecflowers.com">info@tpecflowers.com</a> | +234 9053065636</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`Sending password reset email to ${email}`);

    const info = await transporter.sendMail({
      from: `"TPEC Events" <${smtpUser}>`,
      to: email,
      subject: "Reset Your Password - TPEC Events",
      text: `You requested to reset your password. Click this link to reset it: ${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\nTPEC Events - Creating Memorable Experiences`,
      html: htmlContent,
    });

    console.log(`Password reset email sent successfully to ${email}, messageId: ${info.messageId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Password reset email sent successfully", messageId: info.messageId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Password reset email error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error stack:", errorStack);
    
    return new Response(
      JSON.stringify({ error: `Failed to send password reset email: ${errorMessage}` }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
