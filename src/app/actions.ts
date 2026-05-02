'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function submitContact(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const details = formData.get('details') as string;

  if (!name || !email || !details) {
    return { error: 'ALL FIELDS ARE REQUIRED.' };
  }

  // Insert into database
  const { error } = await supabaseAdmin.from('contact_messages').insert({
    name,
    email,
    details
  });

  if (error) {
    console.error('Error inserting message:', error);
    return { error: 'FAILED TO TRANSMIT MESSAGE. PLEASE TRY AGAIN.' };
  }

  // Get Telegram config from database
  const { data: info } = await supabaseAdmin
    .from('portfolio_info')
    .select('telegram_bot_token, telegram_chat_id')
    .eq('id', 1)
    .single();

  const botToken = info?.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = info?.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    const text = `🚨 *NEW CONTACT INITIATED* 🚨\n\n👤 *NAME:* ${name}\n✉️ *EMAIL:* ${email}\n📝 *DETAILS:* ${details}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
    } catch (err) {
      console.error('Failed to send Telegram notification:', err);
    }
  }

  return { success: true };
}