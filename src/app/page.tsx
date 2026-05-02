import ProjectGrid from "@/components/ProjectGrid";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import { AnimatedSection, AnimatedText } from "@/components/AnimatedSection";

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
      <section className="min-h-screen w-full flex flex-col justify-end p-4 pb-12 md:p-12 md:pb-24 border-b-[3px] border-foreground relative overflow-hidden bg-background pt-24">
        <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="relative z-10 mix-blend-difference text-background flex flex-col gap-6">
          <AnimatedText 
            text={heroTitle} 
            className="text-[12vw] leading-[0.85] uppercase break-words tracking-tighter"
            smoke={true}
          />
          <p className="font-mono max-w-lg text-base md:text-lg border-l-4 border-background pl-6 ml-2 uppercase opacity-90">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <AnimatedSection id="about" className="py-32 px-4 md:px-12 border-b-[3px] border-foreground bg-background">
        <h2 className="text-5xl md:text-7xl mb-16 tracking-tighter border-b-2 border-foreground inline-block pb-2">PHILOSOPHY</h2>
        <AnimatedText 
          text={aboutText} 
          className="text-2xl md:text-4xl lg:text-5xl font-mono leading-tight max-w-6xl uppercase"
        />
      </AnimatedSection>

      <section className="bg-background w-full py-24 min-h-screen border-b-[3px] border-foreground">
        <AnimatedSection className="px-4 md:px-12 pb-12 flex flex-col md:flex-row md:justify-between md:items-end border-b-[3px] border-foreground mb-12 gap-4">
          <h2 className="text-7xl md:text-9xl leading-[0.85] tracking-tighter">SELECTED<br/>WORKS</h2>
          <span className="font-mono text-2xl md:text-4xl border-2 border-foreground p-4 bg-foreground text-background">[{projects?.length || 0}]</span>
        </AnimatedSection>
        
        <ProjectGrid projects={projects || []} />
      </section>
      
      <AnimatedSection id="contact" className="py-32 px-4 md:px-12 bg-foreground text-background">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-6xl md:text-8xl mb-12 leading-none tracking-tighter mix-blend-difference">INITIATE<br/>CONTACT</h2>
            <form className="flex flex-col gap-8 font-mono text-lg">
              <input type="text" placeholder="NAME" className="bg-transparent border-b-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-colors placeholder:text-background/50" />
              <input type="email" placeholder="EMAIL" className="bg-transparent border-b-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-colors placeholder:text-background/50" />
              <textarea placeholder="PROJECT DETAILS" rows={5} className="bg-transparent border-b-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-colors resize-none placeholder:text-background/50"></textarea>
              <button type="button" className="self-start border-4 border-background py-4 px-12 hover:bg-background hover:text-foreground transition-colors text-2xl font-bold tracking-widest mt-4">
                TRANSMIT
              </button>
            </form>
          </div>
          <div className="font-mono flex flex-col justify-end gap-16 text-lg uppercase border-l-4 border-background/20 pl-8 lg:pl-16">
            <div>
              <strong className="text-2xl border-b-2 border-background inline-block mb-4">HQ</strong><br/>
              <span className="text-xl leading-relaxed">{address}</span>
            </div>
            <div>
              <strong className="text-2xl border-b-2 border-background inline-block mb-4">COMMS</strong><br/>
              <span className="text-xl leading-relaxed block mb-2">{email}</span>
              <span className="text-xl leading-relaxed">{phone}</span>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
