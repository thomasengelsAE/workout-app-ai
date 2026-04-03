import { signIn } from '@/lib/auth';

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">FitAI</h1>
        <p className="mt-2 text-zinc-400">Your AI-powered training coach</p>
      </div>
      <form
        action={async () => {
          'use server';
          await signIn('keycloak', { redirectTo: '/dashboard' });
        }}
      >
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white active:bg-indigo-700"
        >
          Sign in to get started
        </button>
      </form>
    </main>
  );
}
