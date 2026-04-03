export default function AuthError() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-zinc-400">Something went wrong signing you in. Please try again.</p>
      <a href="/login" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white">
        Back to login
      </a>
    </main>
  );
}
