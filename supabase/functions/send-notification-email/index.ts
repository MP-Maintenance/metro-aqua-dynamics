import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAILS = ['isa@metro-pools.com', 'mohisathinks@gmail.com'];
const FROM_EMAIL = 'Metro Pools <onboarding@resend.dev>';

interface QuoteNotification {
  type: 'quote';
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    category: string;
  }>;
}

interface InquiryNotification {
  type: 'inquiry';
  inquiryType: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

interface PreConsultationNotification {
  type: 'pre-consultation';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceRequired: string;
  facilityType?: string;
  dimensions?: {
    length?: number;
    width?: number;
    depth?: number;
  };
}

type NotificationData = QuoteNotification | InquiryNotification | PreConsultationNotification;

function generateQuoteEmailHTML(data: QuoteNotification): string {
  const itemsList = data.items.map(item => 
    `<div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
      <p style="color: #0D2D44; font-size: 16px; font-weight: 600; margin: 0 0 8px;">${item.name}</p>
      <p style="color: #587C88; font-size: 14px; margin: 0;">Quantity: ${item.quantity} | Category: ${item.category}</p>
    </div>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 0 auto;">
                <tr>
                  <td style="padding: 32px 20px; text-align: center; background-color: #051B2C;">
                    <img src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png" alt="Metro Pools" style="max-width: 200px; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 20px 20px; text-align: center;">
                    <h1 style="color: #0D2D44; font-size: 28px; font-weight: bold; margin: 0;">New Quote Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">A new quote request has been submitted and requires your attention.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Customer Information</h2>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Name:</strong> ${data.customerName}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Requested Items</h2>
                    ${itemsList}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">Please log in to the admin dashboard to review and respond to this quote request.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 48px 20px 0; text-align: center;">
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">© 2025 Metro Pools W.L.L. | Swimming Pool Specialists in Qatar</p>
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">
                      <a href="https://metro-pools.com" style="color: #00A99D; text-decoration: none;">www.metro-pools.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function generateInquiryEmailHTML(data: InquiryNotification): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 0 auto;">
                <tr>
                  <td style="padding: 32px 20px; text-align: center; background-color: #051B2C;">
                    <img src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png" alt="Metro Pools" style="max-width: 200px; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 20px 20px; text-align: center;">
                    <h1 style="color: #0D2D44; font-size: 28px; font-weight: bold; margin: 0;">New ${data.inquiryType}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">A new inquiry has been submitted and requires your attention.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Customer Information</h2>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Name:</strong> ${data.fullName}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Inquiry Details</h2>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Type:</strong> ${data.inquiryType}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Service:</strong> ${data.serviceType}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Message</h2>
                    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin-top: 12px;">
                      <p style="color: #0D2D44; font-size: 15px; line-height: 24px; margin: 0; white-space: pre-wrap;">${data.message}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">Please log in to the admin dashboard to review and respond to this inquiry.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 48px 20px 0; text-align: center;">
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">© 2025 Metro Pools W.L.L. | Swimming Pool Specialists in Qatar</p>
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">
                      <a href="https://metro-pools.com" style="color: #00A99D; text-decoration: none;">www.metro-pools.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function generatePreConsultationEmailHTML(data: PreConsultationNotification): string {
  const dimensionsText = data.dimensions 
    ? `<div style="background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-top: 12px;">
        <p style="color: #0D2D44; font-size: 14px; font-weight: 600; margin: 0 0 8px;">Dimensions</p>
        <p style="color: #587C88; font-size: 15px; margin: 0;">
          ${data.dimensions.length || 'N/A'}m × ${data.dimensions.width || 'N/A'}m × ${data.dimensions.depth || 'N/A'}m
        </p>
      </div>`
    : '';

  const facilityTypeText = data.facilityType 
    ? `<p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Facility Type:</strong> ${data.facilityType}</p>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 0 auto;">
                <tr>
                  <td style="padding: 32px 20px; text-align: center; background-color: #051B2C;">
                    <img src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png" alt="Metro Pools" style="max-width: 200px; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 20px 20px; text-align: center;">
                    <h1 style="color: #0D2D44; font-size: 28px; font-weight: bold; margin: 0;">New Pre-Consultation Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">A new pre-consultation has been submitted and requires your attention.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Customer Information</h2>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Name:</strong> ${data.customerName}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px;">
                    <h2 style="color: #0D2D44; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Project Details</h2>
                    <p style="color: #587C88; font-size: 15px; line-height: 24px; margin: 8px 0;"><strong>Service Required:</strong> ${data.serviceRequired}</p>
                    ${facilityTypeText}
                    ${dimensionsText}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 20px; text-align: center;">
                    <p style="color: #587C88; font-size: 16px; line-height: 26px; margin: 0;">Please log in to the admin dashboard to review the full details and respond to this pre-consultation request.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 48px 20px 0; text-align: center;">
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">© 2025 Metro Pools W.L.L. | Swimming Pool Specialists in Qatar</p>
                    <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 4px 0;">
                      <a href="https://metro-pools.com" style="color: #00A99D; text-decoration: none;">www.metro-pools.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationData = await req.json();
    
    let subject = '';
    let html = '';

    switch (data.type) {
      case 'quote':
        subject = `New Quote Request from ${data.customerName}`;
        html = generateQuoteEmailHTML(data);
        break;
      case 'inquiry':
        subject = `New ${data.inquiryType} from ${data.fullName}`;
        html = generateInquiryEmailHTML(data);
        break;
      case 'pre-consultation':
        subject = `New Pre-Consultation Request from ${data.customerName}`;
        html = generatePreConsultationEmailHTML(data);
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully to:', ADMIN_EMAILS);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-notification-email function:', error);
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? { name: error.name, stack: error.stack } : {};
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
