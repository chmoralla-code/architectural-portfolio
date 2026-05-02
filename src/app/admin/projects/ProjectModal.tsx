'use client';

import { useState, useRef, DragEvent, ClipboardEvent, useEffect } from 'react';
import { saveProject } from './actions';

export default function ProjectModal({ project }: { project?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pastedFile, setPastedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPastedFile(null);
      setPreviewUrl(project?.image_url || null);
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (project?.id) formData.append('id', project.id);
      if (project?.image_url) formData.append('current_image_url', project.image_url);
      
      // Ensure the dropped/pasted file is included if the input value somehow didn't sync
      if (pastedFile && !formData.get('image')) {
        formData.append('image', pastedFile);
      }
      
      const res = await saveProject(formData);
      if (res && res.error) {
        alert(res.error);
      } else {
        setOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while saving the project.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setPastedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          if (fileInputRef.current) {
             const dataTransfer = new DataTransfer();
             dataTransfer.items.add(file);
             fileInputRef.current.files = dataTransfer.files;
          }
        }
        break;
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPastedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (fileInputRef.current) {
         const dataTransfer = new DataTransfer();
         dataTransfer.items.add(file);
         fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPastedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
          <div 
            className="bg-background border-2 border-foreground shadow-brut max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
              
              <div className="flex flex-col gap-2">
                <label className="font-bold">IMAGE (PASTE OR DROP HERE)</label>
                
                {previewUrl && (
                  <div className="w-full aspect-video border-2 border-foreground bg-muted overflow-hidden relative mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="border-2 border-dashed border-foreground/50 p-4 text-center hover:bg-foreground/5 transition-colors">
                  <input 
                    ref={fileInputRef}
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="w-full h-full cursor-pointer opacity-0 absolute inset-0"
                  />
                  <div className="pointer-events-none">
                    {pastedFile ? pastedFile.name : (previewUrl ? 'CLICK TO CHANGE IMAGE' : 'CLICK, DROP, OR PASTE IMAGE HERE')}
                  </div>
                </div>
                
                {project?.image_url && !pastedFile && <span className="text-xs mt-1 italic text-muted">Current image will be kept if no new file is selected.</span>}
              </div>

              <button type="submit" disabled={loading} className="border-2 border-foreground bg-foreground text-background py-3 font-bold uppercase mt-4 hover:bg-background hover:text-foreground transition-colors disabled:opacity-50 relative z-10">
                {loading ? 'SAVING...' : 'SAVE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}