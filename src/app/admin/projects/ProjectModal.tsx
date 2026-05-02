'use client';

import { useState } from 'react';
import { saveProject } from './actions';

export default function ProjectModal({ project }: { project?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (project?.id) formData.append('id', project.id);
    if (project?.image_url) formData.append('current_image_url', project.image_url);
    
    await saveProject(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className={project ? "font-mono text-sm hover:line-through" : "border-2 border-foreground px-4 py-2 font-mono text-sm hover:bg-foreground hover:text-background"}
      >
        {project ? 'EDIT' : 'NEW PROJECT'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm text-foreground">
          <div className="bg-background border-2 border-foreground shadow-brut max-w-lg w-full p-8 relative">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 font-mono text-xl hover:text-accent">&times;</button>
            <h2 className="text-2xl mb-6">{project ? 'EDIT' : 'NEW'} PROJECT</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-sm">
              <div className="flex flex-col gap-1">
                <label className="font-bold">TITLE</label>
                <input name="title" defaultValue={project?.title} required className="border-2 border-foreground bg-transparent p-2 outline-none focus:bg-foreground focus:text-background" />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="font-bold">CLIENT</label>
                  <input name="client" defaultValue={project?.client} required className="border-2 border-foreground bg-transparent p-2 outline-none focus:bg-foreground focus:text-background" />
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <label className="font-bold">YEAR</label>
                  <input name="year" type="number" defaultValue={project?.year || new Date().getFullYear()} required className="border-2 border-foreground bg-transparent p-2 outline-none focus:bg-foreground focus:text-background" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">DESCRIPTION</label>
                <textarea name="description" defaultValue={project?.description} rows={3} className="border-2 border-foreground bg-transparent p-2 outline-none focus:bg-foreground focus:text-background resize-none"></textarea>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">IMAGE</label>
                <input name="image" type="file" accept="image/*" className="border-2 border-foreground p-1 file:bg-foreground file:text-background file:border-0 file:px-4 file:py-2 file:font-mono file:text-sm cursor-pointer" />
                {project?.image_url && <span className="text-xs mt-1 italic text-muted">Current image will be kept if no new file is selected.</span>}
              </div>
              <button type="submit" disabled={loading} className="border-2 border-foreground bg-foreground text-background py-3 font-bold uppercase mt-4 hover:bg-background hover:text-foreground transition-colors disabled:opacity-50">
                {loading ? 'SAVING...' : 'SAVE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
