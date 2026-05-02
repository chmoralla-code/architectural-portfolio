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
    const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    let mimeType = imageFile.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (fileExt === 'png') mimeType = 'image/png';
      else if (fileExt === 'gif') mimeType = 'image/gif';
      else if (fileExt === 'webp') mimeType = 'image/webp';
      else if (fileExt === 'svg') mimeType = 'image/svg+xml';
      else mimeType = 'image/jpeg';
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('portfolio_images')
      .upload(fileName, buffer, {
        contentType: mimeType,
      });

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
    const { error } = await supabaseAdmin.from('projects').update(projectData).eq('id', id);
    if (error) {
      console.error('Update Error:', error);
      return { error: error.message || 'Failed to update project.' };
    }
  } else {
    const { error } = await supabaseAdmin.from('projects').insert(projectData);
    if (error) {
      console.error('Insert Error:', error);
      return { error: error.message || 'Failed to create project.' };
    }
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
  return { success: true };
}
