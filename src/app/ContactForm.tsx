'use client';

import { useState } from 'react';
import { submitContact } from './actions';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const res = await submitContact(formData);
    
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 font-mono text-lg">
      <input name="name" type="text" placeholder="NAME" required className="bg-foreground border-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-all placeholder:text-background/50 font-bold" />
      <input name="email" type="email" placeholder="EMAIL" required className="bg-foreground border-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-all placeholder:text-background/50 font-bold" />
      <textarea name="details" placeholder="PROJECT DETAILS" required rows={5} className="bg-foreground border-4 border-background p-4 outline-none focus:bg-background focus:text-foreground transition-all resize-none placeholder:text-background/50 font-bold"></textarea>
      
      {errorMsg && <div className="bg-accent text-background p-4 font-bold uppercase">{errorMsg}</div>}
      {success && <div className="bg-background text-foreground p-4 font-bold uppercase border-l-8 border-accent">TRANSMISSION SUCCESSFUL. WE WILL BE IN TOUCH.</div>}
      
      <button type="submit" disabled={loading} className="self-start bg-accent border-4 border-background py-4 px-12 hover:bg-background hover:text-foreground transition-colors text-2xl font-bold tracking-widest mt-4 shadow-[8px_8px_0_var(--background)] active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[8px_8px_0_var(--background)]">
        {loading ? 'TRANSMITTING...' : 'TRANSMIT'}
      </button>
    </form>
  );
}