'use client';

import { useState } from 'react';
import { saveTelegramConfig } from './actions';

export default function TelegramConfigClient({ currentToken, currentChatId }: { currentToken: string, currentChatId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    
    const formData = new FormData(e.currentTarget);
    const res = await saveTelegramConfig(formData);
    
    if (res.error) {
      setStatus('error');
      setErrMsg(res.error);
    } else {
      setStatus('success');
    }
    
    setLoading(false);
    
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <div className="border-4 border-foreground p-6 mb-12 bg-background">
      <h2 className="text-2xl font-bold mb-6 uppercase tracking-tighter border-b-4 border-foreground inline-block pb-2">TELEGRAM NOTIFICATIONS</h2>
      <p className="font-mono text-sm mb-6 max-w-2xl">
        Enter your Telegram Bot Token (from @BotFather) and your Chat ID (from @userinfobot). A test message will be sent when you click save.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-bold text-sm">BOT TOKEN</label>
            <input 
              name="bot_token" 
              defaultValue={currentToken} 
              className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background transition-colors" 
              placeholder="e.g., 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-bold text-sm">CHAT ID</label>
            <input 
              name="chat_id" 
              defaultValue={currentChatId} 
              className="bg-transparent border-2 border-foreground p-3 outline-none focus:bg-foreground focus:text-background transition-colors" 
              placeholder="e.g., 123456789"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <button 
            type="submit" 
            disabled={loading} 
            className="border-2 border-accent bg-accent text-background px-8 py-3 font-bold uppercase hover:bg-background hover:text-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'SAVING...' : 'SAVE CONFIG'}
          </button>
          
          {status === 'success' && <span className="text-accent font-bold uppercase animate-pulse">SAVED! TEST MESSAGE SENT.</span>}
          {status === 'error' && <span className="text-foreground font-bold uppercase">{errMsg}</span>}
        </div>
      </form>
    </div>
  );
}