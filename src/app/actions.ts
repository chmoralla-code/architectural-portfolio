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
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'UTC', 
      hour12: true,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const text = `<b>[ ARCH // STUDIO ] INCOMING CONTACT</b>\n` +
                 `━━━━━━━━━━━━━━━━━━━━\n` +
                 `<b>SENDER:</b> ${name.toUpperCase()}\n` +
                 `<b>EMAIL:</b> ${email.toLowerCase()}\n` +
                 `<b>TIME:</b> ${timestamp} UTC\n\n` +
                 `<b>MESSAGE:</b>\n<i>${details}</i>\n` +
                 `━━━━━━━━━━━━━━━━━━━━`;
    
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('Failed to send Telegram notification:', err);
    }
  }

  return { success: true };
}