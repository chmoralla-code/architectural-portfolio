"use client";

import { motion } from "framer-motion";
import { Project } from "@/lib/supabase";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8" id="work">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="group relative border-brut shadow-brut hover:shadow-none transition-all duration-300 translate-x-0 translate-y-0 hover:translate-x-1 hover:translate-y-1 bg-background overflow-hidden"
        >
          <div className="aspect-[4/3] bg-muted w-full relative overflow-hidden mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
            {project.image_url ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image_url} alt={project.title} className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-background bg-foreground">NO IMAGE</div>
            )}
          </div>
          <div className="p-4 border-t-2 border-foreground bg-background group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
            <h3 className="text-2xl mb-2">{project.title}</h3>
            <div className="flex justify-between font-mono text-sm border-t-2 border-current pt-2 mt-2">
              <span>{project.client}</span>
              <span>{project.year}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
