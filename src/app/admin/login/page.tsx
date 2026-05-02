'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await login(formData);
      return result;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <form action={formAction} className="border-brut p-8 max-w-md w-full shadow-brut flex flex-col gap-6 bg-background">
        <h1 className="text-4xl mb-4">RESTRICTED<br/>ACCESS</h1>
        
        {state?.error && (
          <div className="bg-foreground text-background p-2 font-mono text-sm border-2 border-foreground">
            {state.error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm uppercase">IDENTIFIER</label>
          <input 
            name="username" 
            type="text" 
            required 
            className="bg-transparent border-2 border-foreground p-3 font-mono outline-none focus:bg-foreground focus:text-background transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm uppercase">PASSPHRASE</label>
          <input 
            name="password" 
            type="password" 
            required 
            className="bg-transparent border-2 border-foreground p-3 font-mono outline-none focus:bg-foreground focus:text-background transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="mt-4 border-2 border-foreground bg-background text-foreground py-4 font-bold uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {isPending ? 'AUTHENTICATING...' : 'AUTHORIZE'}
        </button>
      </form>
    </div>
  );
}
