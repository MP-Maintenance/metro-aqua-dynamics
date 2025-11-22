import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Verify admin status
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin using secure has_role function
    const { data: isAdmin, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, requestContext } = await req.json();

    // Fetch database context if requested
    let contextData = '';
    if (requestContext) {
      console.log('Fetching context data for tables:', requestContext);
      
      // Fetch data from requested tables
      const tableQueries = [];
      
      if (requestContext.includes('products')) {
        const { data } = await supabase.from('products').select('*').limit(100);
        if (data) tableQueries.push(`Products (${data.length} items): ${JSON.stringify(data.slice(0, 5))}`);
      }
      
      if (requestContext.includes('users')) {
        const { data } = await supabase.from('profiles').select('*').limit(100);
        if (data) tableQueries.push(`Users (${data.length} items): ${JSON.stringify(data.slice(0, 5))}`);
      }
      
      if (requestContext.includes('categories')) {
        const { data } = await supabase.from('categories').select('*');
        if (data) tableQueries.push(`Categories: ${JSON.stringify(data)}`);
      }
      
      if (requestContext.includes('quotes')) {
        const { data } = await supabase.from('quote_requests').select('*, profiles(full_name)').limit(50);
        if (data) tableQueries.push(`Quote Requests (${data.length} items): ${JSON.stringify(data.slice(0, 5))}`);
      }
      
      if (requestContext.includes('reviews')) {
        const { data } = await supabase.from('reviews').select('*').limit(50);
        if (data) tableQueries.push(`Reviews (${data.length} items): ${JSON.stringify(data.slice(0, 5))}`);
      }
      
      if (requestContext.includes('consultations')) {
        const { data } = await supabase.from('pre_consultations').select('*, profiles(full_name)').limit(50);
        if (data) tableQueries.push(`Pre-Consultations (${data.length} items): ${JSON.stringify(data.slice(0, 5))}`);
      }
      
      if (requestContext.includes('faqs')) {
        const { data } = await supabase.from('faqs').select('*');
        if (data) tableQueries.push(`FAQs (${data.length} items): ${JSON.stringify(data)}`);
      }
      
      if (requestContext.includes('company')) {
        const { data } = await supabase.from('company_details').select('*').single();
        if (data) tableQueries.push(`Company Details: ${JSON.stringify(data)}`);
      }
      
      contextData = tableQueries.join('\n\n');
    }

    const systemPrompt = `You are Tinik (short for Matinik, meaning "sharp/keen" in Filipino), a professional AI assistant for Metro Pools' admin dashboard.

PERSONALITY & TONE:
- Professional, precise, helpful, and polite
- Friendly but business-like
- Provide actionable guidance without unnecessary chatter
- Be concise yet thorough

LANGUAGE SUPPORT:
- Detect and respond in the user's language (English, Arabic, or Filipino/Tagalog)
- Maintain professional tone in all languages

YOUR CAPABILITIES:
- Access and analyze Metro Pools backend data from Supabase
- Provide insights on users, products, categories, quotes, reviews, consultations, FAQs, and company details
- Offer guidance on using admin features
- Explain backend data and system operations
- Support CRUD operations with clear instructions and confirmations

DATABASE CONTEXT:
${contextData ? `\n\nCurrent Database Summary:\n${contextData}\n` : ''}

GUIDELINES:
- Always verify data before providing specific numbers or details
- Suggest best practices for admin operations
- Warn about potential issues or security concerns
- Offer step-by-step guidance for complex tasks
- Keep responses focused and actionable

Remember: You're helping admins manage Metro Pools efficiently. Be their trusted assistant.`;

    console.log('Calling OpenAI API with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Stream the response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in admin-chat function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
