import ProjectGrid from "@/components/ProjectGrid";
import { supabase, Project } from "@/lib/supabase";

// Revalidate occasionally, or leave dynamic depending on requirements
export const revalidate = 3600;

export default async function Home() {
  // Fetch projects from Supabase
  let projects: Project[] = [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });
      
    if (error) throw error;
    if (data) projects = data;
  } catch (err) {
    console.error("Error fetching projects, using fallback data:", err);
    // Fallback dummy data for visual testing before DB is populated
    projects = [
      { id: "1", title: "CONCRETE MONOLITH", description: "A brutalist residential complex.", image_url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop", year: 2025, client: "PRIVATE" },
      { id: "2", title: "VOID GALLERY", description: "Exhibition space carved from stone.", image_url: "https://images.unsplash.com/photo-1600607688066-890987f18a86?q=80&w=1000&auto=format&fit=crop", year: 2024, client: "CITY ARTS" },
      { id: "3", title: "STEEL & GLASS PAVILION", description: "Industrial pavilion.", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop", year: 2023, client: "TECH CORP" },
      { id: "4", title: "RAW FORM HQ", description: "Corporate headquarters.", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop", year: 2022, client: "RAW INC" }
    ];
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col justify-end p-4 pb-12 md:p-8 md:pb-16 border-b-2 border-foreground relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           {/* Abstract brutalist grid background */}
          <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="relative z-10 mix-blend-difference text-background">
          <h1 className="text-[12vw] leading-[0.8] mb-4">
            FORM <br />
            FOLLOWS <br />
            NOTHING
          </h1>
          <p className="font-mono max-w-md text-sm md:text-base border-l-2 border-background pl-4 ml-2">
            WE CREATE RADICAL, UNCOMPROMISING STRUCTURES THAT CHALLENGE THE STATUS QUO. 
            BRUTALIST ESTHETICS FOR A MODERN ERA.
          </p>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="bg-background w-full py-16 min-h-screen">
        <div className="px-8 pb-8 flex justify-between items-end border-b-2 border-foreground mb-8">
          <h2 className="text-6xl md:text-8xl">SELECTED<br/>WORKS</h2>
          <span className="font-mono text-xl">[{projects.length}]</span>
        </div>
        
        <ProjectGrid projects={projects} />
      </section>
      
      {/* ABOUT / CONTACT SECTION */}
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
          <div className="font-mono flex flex-col justify-end gap-8 text-sm">
            <div>
              <strong>HQ</strong><br/>
              1984 CONCRETE AVENUE<br/>
              SECTOR 7G, NEOTOKYO<br/>
              EARTH
            </div>
            <div>
              <strong>COMMS</strong><br/>
              INFO@ARCHSTUDIO.COM<br/>
              +1 800 BRUTAL
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
