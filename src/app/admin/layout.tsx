import { logout } from './actions';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <aside className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-foreground p-6 flex flex-col justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter">CONTROL<br/>PANEL</h2>
          <nav className="flex flex-col gap-4 font-mono text-sm">
            <Link href="/admin" className="hover:line-through">GLOBAL INFO</Link>
            <Link href="/admin/projects" className="hover:line-through">PROJECTS</Link>
            <a href="/" target="_blank" className="hover:line-through mt-8">VIEW SITE &#8599;</a>
          </nav>
        </div>
        <form action={logout}>
          <button className="font-mono text-sm hover:line-through mt-8 text-accent">TERMINATE SESSION</button>
        </form>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
