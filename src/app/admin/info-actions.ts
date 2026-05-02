'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function updatePortfolioInfo(formData: FormData) {
  const data = {
    hero_title: formData.get('hero_title') as string,
    hero_subtitle: formData.get('hero_subtitle') as string,
    about_text: formData.get('about_text') as string,
    contact_email: formData.get('contact_email') as string,
    contact_phone: formData.get('contact_phone') as string,
    contact_address: formData.get('contact_address') as string,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseAdmin
    .from('portfolio_info')
    .upsert({ id: 1, ...data });

  if (error) {
    console.error('Update error:', error);
    return;
  }

  revalidatePath('/');
  revalidatePath('/admin');
}
