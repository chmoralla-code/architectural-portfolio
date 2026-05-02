import { supabaseAdmin } from "@/lib/supabase-admin";
import InboxClient from "./InboxClient";

export const revalidate = 0;

export default async function InboxPage() {
  const { data: messages } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter uppercase border-b-8 border-accent pb-4 inline-block">COMMUNICATIONS</h1>
      
      {(!messages || messages.length === 0) ? (
        <div className="border-4 border-foreground p-12 text-center font-mono text-xl bg-foreground text-background font-bold uppercase">
          NO MESSAGES IN INBOX.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <InboxClient key={msg.id} msg={msg} />
          ))}
        </div>
      )}
    </div>
  );
}