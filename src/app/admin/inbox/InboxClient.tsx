'use client';

import { markAsRead, deleteMessage } from "./actions";

export default function InboxClient({ msg }: { msg: any }) {
  const date = new Date(msg.created_at).toLocaleString();

  return (
    <div className={`border-4 p-6 transition-all duration-300 font-mono ${msg.read ? 'border-foreground/30 bg-background' : 'border-foreground bg-muted/20 shadow-brut'}`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 border-b-4 border-current pb-4">
        <div>
          <h3 className="text-2xl font-bold break-all">{msg.name}</h3>
          <a href={`mailto:${msg.email}`} className="text-lg hover:line-through text-accent font-bold break-all">{msg.email}</a>
        </div>
        <div className="text-sm font-bold opacity-70 whitespace-nowrap">{date}</div>
      </div>
      
      <p className="text-lg whitespace-pre-wrap leading-relaxed font-bold mb-8">{msg.details}</p>
      
      <div className="flex flex-wrap gap-4 mt-4">
        {!msg.read && (
          <button 
            onClick={() => markAsRead(msg.id)}
            className="border-2 border-foreground px-6 py-2 font-bold text-sm hover:bg-foreground hover:text-background uppercase transition-colors"
          >
            MARK AS READ
          </button>
        )}
        <button 
          onClick={() => deleteMessage(msg.id)}
          className="border-2 border-accent text-accent px-6 py-2 font-bold text-sm hover:bg-accent hover:text-background uppercase transition-colors"
        >
          DELETE
        </button>
      </div>
    </div>
  );
}