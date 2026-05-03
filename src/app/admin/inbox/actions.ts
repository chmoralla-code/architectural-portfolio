'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function markAsRead(id: string) {
  await supabaseAdmin.from('contact_messages').update({ read: true }).eq('id', id);
  revalidatePath('/admin/inbox');
}

export async function deleteMessage(id: string) {
  await supabaseAdmin.from('contact_messages').delete().eq('id', id);
  revalidatePath('/admin/inbox');
}

export async function saveTelegramConfig(formData: FormData) {
  const token = formData.get('bot_token') as string;
  const chatId = formData.get('chat_id') as string;

  const { error } = await supabaseAdmin
    .from('portfolio_info')
    .update({ telegram_bot_token: token, telegram_chat_id: chatId })
    .eq('id', 1);

  if (error) {
    console.error('Error saving Telegram config:', error);
    return { error: 'Failed to save configuration.' };
  }

  // Send a test message
  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '✅ *TELEGRAM INTEGRATION SUCCESSFUL*\n\nYour portfolio is now connected and will notify you here when someone initiates contact.',
          parse_mode: 'Markdown',
        }),
      });
    } catch (err) {
      console.error('Failed to send test message:', err);
    }
  }

  revalidatePath('/admin/inbox');
  return { success: true };
}

export async function testTelegramNotification() {
  const { data: info } = await supabaseAdmin
    .from('portfolio_info')
    .select('telegram_bot_token, telegram_chat_id')
    .eq('id', 1)
    .single();

  const botToken = info?.telegram_bot_token;
  const chatId = info?.telegram_chat_id;

  if (!botToken || !chatId) {
    return { error: 'TELEGRAM CONFIGURATION MISSING.' };
  }

  const text = `<b>[ ARCH // STUDIO ] TEST NOTIFICATION</b>\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `STATUS: <b>SUCCESSFUL</b>\n` +
               `TIME: <b>${new Date().toLocaleString()}</b>\n\n` +
               `THIS IS A TEST MESSAGE TO VERIFY YOUR TELEGRAM INTEGRATION IS WORKING CORRECTLY.\n` +
               `━━━━━━━━━━━━━━━━━━━━`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.description || 'TELEGRAM API ERROR' };
    }
    
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'CONNECTION FAILED' };
  }
}