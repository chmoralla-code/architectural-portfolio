import { supabaseAdmin } from '@/lib/supabase-admin';
import { deleteProject } from './actions';
import ProjectModal from './ProjectModal';

export const revalidate = 0;

export default async function AdminProjects() {
  const { data: projects } = await supabaseAdmin.from('projects').select('*').order('year', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-end border-b-2 border-foreground pb-4 mb-8">
        <h1 className="text-4xl">PROJECTS</h1>
        <ProjectModal />
      </div>

      <div className="grid gap-4">
        {projects?.map((p) => (
          <div key={p.id} className="border-2 border-foreground p-4 flex justify-between items-center bg-background hover:bg-foreground hover:text-background transition-colors group">
            <div>
              <div className="font-bold text-xl">{p.title}</div>
              <div className="font-mono text-sm">{p.client} // {p.year}</div>
            </div>
            <div className="flex gap-4 items-center">
              <ProjectModal project={p} />
              <form action={async () => {
                'use server';
                await deleteProject(p.id);
              }}>
                <button type="submit" className="font-mono text-sm text-accent hover:line-through">DELETE</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
