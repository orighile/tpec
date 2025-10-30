
// Supabase Edge Function: Send Notification Email
// Sends various types of notification emails to users

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { type, to, data } = await req.json();

    // Email templates
    const templates = {
      order_confirmation: {
        subject: 'Order Confirmation - Your Tickets are Ready!',
        html: `
          <h2>Order Confirmation</h2>
          <p>Thank you for your purchase! Your order #${data.orderId} has been confirmed.</p>
          <p><strong>Event:</strong> ${data.eventTitle}</p>
          <p><strong>Total Amount:</strong> ₦${data.amount}</p>
          <p>Your tickets will be available in your account shortly.</p>
        `
      },
      event_reminder: {
        subject: `Reminder: ${data.eventTitle} is coming up!`,
        html: `
          <h2>Event Reminder</h2>
          <p>Don't forget about ${data.eventTitle}!</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
          <p><strong>Location:</strong> ${data.eventLocation}</p>
          <p>We look forward to seeing you there!</p>
        `
      },
      vendor_booking_confirmation: {
        subject: 'Vendor Booking Confirmation',
        html: `
          <h2>Booking Confirmed</h2>
          <p>Your vendor booking has been confirmed!</p>
          <p><strong>Vendor:</strong> ${data.vendorName}</p>
          <p><strong>Event:</strong> ${data.eventTitle}</p>
          <p><strong>Amount:</strong> ₦${data.amount}</p>
        `
      }
    };

    const template = templates[type as keyof typeof templates];
    if (!template) {
      return new Response('Invalid email type', { status: 400 });
    }

    // In a real implementation, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Mailgun
    // - AWS SES
    
    // For now, we'll just log the email (you should replace this with actual email sending)
    console.log('Email would be sent:', {
      to,
      subject: template.subject,
      html: template.html
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
