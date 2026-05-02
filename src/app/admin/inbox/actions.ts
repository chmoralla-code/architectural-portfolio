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