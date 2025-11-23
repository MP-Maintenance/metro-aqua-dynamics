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
    `<li><strong>${item.name}</strong> - Quantity: ${item.quantity} (${item.category})</li>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8CC63F;">New Quote Request</h2>
      <p>A new quote request has been submitted:</p>
      
      <h3>Customer Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.customerName}</li>
        <li><strong>Email:</strong> ${data.customerEmail}</li>
      </ul>
      
      <h3>Requested Items</h3>
      <ul>
        ${itemsList}
      </ul>
      
      <p style="margin-top: 20px; color: #666;">
        Please log in to the admin dashboard to review and respond to this quote request.
      </p>
    </div>
  `;
}

function generateInquiryEmailHTML(data: InquiryNotification): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8CC63F;">New ${data.inquiryType}</h2>
      <p>A new inquiry has been submitted:</p>
      
      <h3>Customer Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
      </ul>
      
      <h3>Inquiry Details</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Type:</strong> ${data.inquiryType}</li>
        <li><strong>Service:</strong> ${data.serviceType}</li>
      </ul>
      
      <h3>Message</h3>
      <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
        ${data.message}
      </p>
      
      <p style="margin-top: 20px; color: #666;">
        Please log in to the admin dashboard to review and respond to this inquiry.
      </p>
    </div>
  `;
}

function generatePreConsultationEmailHTML(data: PreConsultationNotification): string {
  const dimensionsText = data.dimensions 
    ? `<li><strong>Dimensions:</strong> ${data.dimensions.length || 'N/A'}m × ${data.dimensions.width || 'N/A'}m × ${data.dimensions.depth || 'N/A'}m</li>`
    : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8CC63F;">New Pre-Consultation Request</h2>
      <p>A new pre-consultation has been submitted:</p>
      
      <h3>Customer Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.customerName}</li>
        <li><strong>Email:</strong> ${data.customerEmail}</li>
        <li><strong>Phone:</strong> ${data.customerPhone}</li>
      </ul>
      
      <h3>Project Details</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Service Required:</strong> ${data.serviceRequired}</li>
        ${data.facilityType ? `<li><strong>Facility Type:</strong> ${data.facilityType}</li>` : ''}
        ${dimensionsText}
      </ul>
      
      <p style="margin-top: 20px; color: #666;">
        Please log in to the admin dashboard to review the full details and respond to this pre-consultation request.
      </p>
    </div>
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
