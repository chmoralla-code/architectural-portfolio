'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
  if (error) console.error(error);
  revalidatePath('/admin/projects');
  revalidatePath('/');
}

export async function saveProject(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const client = formData.get('client') as string;
  const year = parseInt(formData.get('year') as string);
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;
  let image_url = formData.get('current_image_url') as string;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('portfolio_images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { error: 'Failed to upload image.' };
    }

    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('portfolio_images')
      .getPublicUrl(fileName);
      
    image_url = publicUrlData.publicUrl;
  }

  const projectData = { title, client, year, description, image_url };

  if (id) {
    await supabaseAdmin.from('projects').update(projectData).eq('id', id);
  } else {
    await supabaseAdmin.from('projects').insert(projectData);
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
  return { success: true };
}
