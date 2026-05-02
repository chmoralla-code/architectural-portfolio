"use client";

import { motion, Variants } from "framer-motion";
import { Project } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 100 }
  }
};

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4 md:p-12" 
      id="work"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02, 
            y: -10,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
          className="group relative border-[3px] border-foreground shadow-brut hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 bg-background overflow-hidden flex flex-col"
        >
          <div className="aspect-[4/3] bg-muted w-full relative overflow-hidden mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
            {project.image_url ? (
               // eslint-disable-next-line @next/next/no-img-element
              <motion.img 
                src={project.image_url} 
                alt={project.title} 
                className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                whileHover={{ scale: 1.05 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-background bg-foreground text-2xl">NO IMAGE</div>
            )}
            
            <div className="absolute inset-0 bg-foreground/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          <div className="p-6 md:p-8 border-t-[3px] border-foreground bg-background group-hover:bg-foreground group-hover:text-background transition-colors duration-300 flex-1 flex flex-col justify-between">
            <h3 className="text-3xl md:text-4xl mb-6 font-bold tracking-tighter uppercase">{project.title}</h3>
            
            <div className="flex justify-between items-end font-mono text-base border-t-[3px] border-current pt-4 mt-auto">
              <span className="uppercase font-bold tracking-widest">{project.client}</span>
              <span className="text-2xl">[{project.year}]</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
