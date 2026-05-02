import ProjectGrid from "@/components/ProjectGrid";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function Home() {
  const { data: info } = await supabaseAdmin
    .from('portfolio_info')
    .select('*')
    .eq('id', 1)
    .single();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false });

  const heroTitle = info?.hero_title || 'FORM FOLLOWS NOTHING';
  const heroSubtitle = info?.hero_subtitle || 'BRUTALIST ESTHETICS FOR A MODERN ERA.';
  const aboutText = info?.about_text || 'We create radical structures.';
  const email = info?.contact_email || 'INFO@ARCHSTUDIO.COM';
  const phone = info?.contact_phone || '+1 800 BRUTAL';
  const address = info?.contact_address || 'EARTH';

  return (
    <>
      <section className="min-h-screen w-full flex flex-col justify-end p-4 pb-12 md:p-8 md:pb-16 border-b-2 border-foreground relative overflow-hidden bg-background pt-24">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="relative z-10 mix-blend-difference text-background">
          <h1 className="text-[10vw] leading-[0.8] mb-4 uppercase break-words">
            {heroTitle.split(' ').map((word: string, i: number) => <span key={i}>{word}<br/></span>)}
          </h1>
          <p className="font-mono max-w-md text-sm md:text-base border-l-2 border-background pl-4 ml-2 uppercase">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section id="about" className="py-24 px-8 border-b-2 border-foreground bg-background">
        <h2 className="text-4xl md:text-6xl mb-12">PHILOSOPHY</h2>
        <p className="text-xl md:text-3xl font-mono leading-relaxed max-w-4xl uppercase">
          {aboutText}
        </p>
      </section>

      <section className="bg-background w-full py-16 min-h-screen border-b-2 border-foreground">
        <div className="px-8 pb-8 flex justify-between items-end border-b-2 border-foreground mb-8">
          <h2 className="text-6xl md:text-8xl">SELECTED<br/>WORKS</h2>
          <span className="font-mono text-xl">[{projects?.length || 0}]</span>
        </div>
        
        <ProjectGrid projects={projects || []} />
      </section>
      
      <section id="contact" className="py-24 px-8 bg-foreground text-background">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl md:text-7xl mb-8">INITIATE<br/>CONTACT</h2>
            <form className="flex flex-col gap-6 font-mono">
              <input type="text" placeholder="NAME" className="bg-transparent border-b-2 border-background p-2 outline-none focus:bg-background focus:text-foreground transition-colors" />
              <input type="email" placeholder="EMAIL" className="bg-transparent border-b-2 border-background p-2 outline-none focus:bg-background focus:text-foreground transition-colors" />
              <textarea placeholder="PROJECT DETAILS" rows={4} className="bg-transparent border-b-2 border-background p-2 outline-none focus:bg-background focus:text-foreground transition-colors resize-none"></textarea>
              <button type="button" className="self-start border-2 border-background py-3 px-8 hover:bg-background hover:text-foreground transition-colors">
                TRANSMIT
              </button>
            </form>
          </div>
          <div className="font-mono flex flex-col justify-end gap-8 text-sm uppercase">
            <div>
              <strong>HQ</strong><br/>
              {address}
            </div>
            <div>
              <strong>COMMS</strong><br/>
              {email}<br/>
              {phone}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
