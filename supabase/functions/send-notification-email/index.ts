import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: string;
  to: string;
  data: Record<string, unknown>;
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
    const { type, to, data }: EmailRequest = await req.json();
    console.log(`Processing email request: type=${type}, to=${to}`);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Email configuration is incomplete" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email templates
    const templates: Record<string, { subject: string; html: string }> = {
      booking_confirmation: {
        subject: "Booking Confirmed - TPEC Events Consultation",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Confirmed!</h1>
                <p>Thank you for booking a consultation with TPEC Events</p>
              </div>
              <div class="content">
                <p>Dear ${data.name},</p>
                <p>Your consultation has been successfully scheduled. Here are your booking details:</p>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <strong>Consultation Type:</strong>
                    <span>${data.consultationType}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Date:</strong>
                    <span>${data.bookingDate}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Time:</strong>
                    <span>${data.bookingTime}</span>
                  </div>
                  ${data.eventType ? `
                  <div class="detail-row">
                    <strong>Event Type:</strong>
                    <span>${data.eventType}</span>
                  </div>
                  ` : ""}
                  <div class="detail-row">
                    <strong>Reference:</strong>
                    <span>#${data.bookingId?.toString().slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
                
                <p><strong>What to Expect:</strong></p>
                <ul>
                  <li>A member of our team will reach out to confirm your appointment</li>
                  <li>Please be ready at your scheduled time for the consultation</li>
                  <li>Prepare any questions or ideas you'd like to discuss</li>
                </ul>
                
                <p>If you need to reschedule or have any questions, please contact us at info@tpecflowers.com or call +234 9053065636.</p>
                
                <div class="footer">
                  <p>TPEC Events - Creating Memorable Experiences</p>
                  <p>Lagos, Nigeria | info@tpecflowers.com | +234 9053065636</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      admin_booking_alert: {
        subject: `New Consultation Booking - ${data.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { font-weight: bold; color: #666; }
              .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Booking Alert</h1>
              </div>
              <div class="content">
                <div class="urgent">
                  <strong>Action Required:</strong> A new consultation has been booked. Please review and confirm with the client.
                </div>
                
                <div class="booking-details">
                  <h3>Customer Details</h3>
                  <div class="detail-row">
                    <span class="label">Name:</span> ${data.name}
                  </div>
                  <div class="detail-row">
                    <span class="label">Email:</span> ${data.email}
                  </div>
                  <div class="detail-row">
                    <span class="label">Phone:</span> ${data.phone || "Not provided"}
                  </div>
                  
                  <h3 style="margin-top: 20px;">Booking Details</h3>
                  <div class="detail-row">
                    <span class="label">Consultation Type:</span> ${data.consultationType}
                  </div>
                  <div class="detail-row">
                    <span class="label">Date:</span> ${data.bookingDate}
                  </div>
                  <div class="detail-row">
                    <span class="label">Time:</span> ${data.bookingTime}
                  </div>
                  <div class="detail-row">
                    <span class="label">Event Type:</span> ${data.eventType || "Not specified"}
                  </div>
                  <div class="detail-row">
                    <span class="label">Booking ID:</span> #${data.bookingId?.toString().slice(0, 8).toUpperCase()}
                  </div>
                  
                  ${data.message ? `
                  <h3 style="margin-top: 20px;">Customer Message</h3>
                  <p style="background: #fff; padding: 15px; border-radius: 5px; font-style: italic;">"${data.message}"</p>
                  ` : ""}
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      order_confirmation: {
        subject: "Order Confirmation - Your Tickets are Ready!",
        html: `
          <h2>Order Confirmation</h2>
          <p>Thank you for your purchase! Your order #${data.orderId} has been confirmed.</p>
          <p><strong>Event:</strong> ${data.eventTitle}</p>
          <p><strong>Total Amount:</strong> ₦${data.amount}</p>
          <p>Your tickets will be available in your account shortly.</p>
        `,
      },
      event_reminder: {
        subject: `Reminder: ${data.eventTitle} is coming up!`,
        html: `
          <h2>Event Reminder</h2>
          <p>Don't forget about ${data.eventTitle}!</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
          <p><strong>Location:</strong> ${data.eventLocation}</p>
          <p>We look forward to seeing you there!</p>
        `,
      },
      vendor_booking_confirmation: {
        subject: "Vendor Booking Confirmation",
        html: `
          <h2>Booking Confirmed</h2>
          <p>Your vendor booking has been confirmed!</p>
          <p><strong>Vendor:</strong> ${data.vendorName}</p>
          <p><strong>Event:</strong> ${data.eventTitle}</p>
          <p><strong>Amount:</strong> ₦${data.amount}</p>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      console.error(`Invalid email type: ${type}`);
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending email via SMTP: ${smtpHost}:${smtpPort}`);

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    await client.send({
      from: smtpUser,
      to: to,
      subject: template.subject,
      content: "Please view this email in an HTML-capable email client.",
      html: template.html,
    });

    await client.close();

    console.log(`Email sent successfully to ${to}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Email sending error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `Failed to send email: ${errorMessage}` }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
