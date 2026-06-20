import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const text = await req.text()
  const { message, type, attachments } = JSON.parse(text)

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'sara.goldscheiderova@gmail.com',
    subject: `TRPG [${type}] New feedback`,
    text: message,
    attachments,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})