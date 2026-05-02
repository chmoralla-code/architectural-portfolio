import { supabaseAdmin } from '@/lib/supabase-admin';
import { updatePortfolioInfo } from './info-actions';

export const revalidate = 0;

export default async function AdminDashboard() {
  const { data } = await supabaseAdmin
    .from('portfolio_info')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl mb-8 border-b-2 border-foreground pb-4">GLOBAL INFORMATION</h1>
      <form action={updatePortfolioInfo} className="flex flex-col gap-6 font-mono text-sm">
        
        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">HERO TITLE</label>
          <input name="hero_title" defaultValue={data?.hero_title} required className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">HERO SUBTITLE</label>
          <textarea name="hero_subtitle" defaultValue={data?.hero_subtitle} required rows={3} className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background resize-none"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">ABOUT TEXT</label>
          <textarea name="about_text" defaultValue={data?.about_text} required rows={6} className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background resize-none"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">CONTACT EMAIL</label>
          <input name="contact_email" defaultValue={data?.contact_email} required className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">CONTACT PHONE</label>
          <input name="contact_phone" defaultValue={data?.contact_phone} required className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="uppercase font-bold">CONTACT ADDRESS</label>
          <input name="contact_address" defaultValue={data?.contact_address} required className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background" />
        </div>

        <button type="submit" className="border-2 border-foreground bg-foreground text-background py-4 font-bold uppercase hover:bg-background hover:text-foreground transition-colors mt-4">
          UPDATE INFORMATION
        </button>
      </form>
    </div>
  );
}
