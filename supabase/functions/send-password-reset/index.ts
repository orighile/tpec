import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
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
    const { email }: PasswordResetRequest = await req.json();
    console.log(`Processing password reset request for: ${email}`);

    // Enhanced email validation
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase admin client to generate password reset link
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Use APP_URL environment variable with fallback
    const appUrl = Deno.env.get("APP_URL") || "https://tpec-64110.lovable.app";
    const redirectTo = `${appUrl}/auth?type=recovery`;
    
    console.log(`Generating reset link with redirect to: ${redirectTo}`);

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: redirectTo,
      },
    });

    if (linkError) {
      console.error("Error generating reset link:", linkError);
      // Don't reveal if email exists or not for security - return success
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, a password reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resetLink = linkData.properties?.action_link;
    
    if (!resetLink) {
      console.error("No reset link generated");
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, a password reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Reset link generated successfully`);

    // SMTP Configuration - Use port 587 (STARTTLS) as default for better reliability
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
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

    // Create nodemailer transporter with proper TLS settings and timeouts
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 45000,
    });

    // Verify SMTP connection before sending
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, a password reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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
            
            <p>Need help? Contact us at <a href="mailto:info@tpecevents.com" style="color: #8B5CF6;">info@tpecevents.com</a> or call <strong>+234 9053065636</strong>.</p>
            
            <div class="footer">
              <p><strong>TPEC Events</strong> - Creating Memorable Experiences</p>
              <p>Lagos, Nigeria</p>
              <p><a href="mailto:info@tpecevents.com">info@tpecevents.com</a> | +234 9053065636</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"TPEC Events" <${smtpUser}>`,
      to: email,
      subject: "Reset Your Password - TPEC Events",
      text: `You requested to reset your password. Click this link to reset it: ${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\nTPEC Events - Creating Memorable Experiences`,
      html: htmlContent,
    };

    console.log(`Sending password reset email to ${email}`);

    // Use Promise.race for timeout protection
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 40 seconds')), 40000)
    );

    try {
      const info = await Promise.race([emailPromise, timeoutPromise]);
      console.log(`Password reset email sent successfully to ${email}, messageId: ${info.messageId}`);

      return new Response(
        JSON.stringify({ success: true, message: "Password reset email sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (sendError) {
      console.error("Email send failed or timed out:", sendError);
      // Return success for security (don't reveal email delivery issues)
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, a password reset link has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  } catch (error: unknown) {
    console.error("Password reset email error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error stack:", errorStack);
    
    // Return success for security (prevent email enumeration)
    return new Response(
      JSON.stringify({ success: true, message: "If an account exists with this email, a password reset link has been sent." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
