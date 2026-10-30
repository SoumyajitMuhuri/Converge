import useAuth from "../hooks/useAuth";

function Auth({ onLogin }) {
  const auth = useAuth(onLogin);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={auth.handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Converge
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {auth.isRegistering
              ? "Create your account to get started."
              : "Welcome back. Sign in to continue."}
          </p>
        </div>

        {auth.isRegistering && (
          <input
            required
            type="text"
            placeholder="Full name"
            value={auth.name}
            onChange={(e) => auth.setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />
        )}

        <input
          required
          type="email"
          placeholder="Email address"
          value={auth.email}
          onChange={(e) => auth.setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
        />

        <input
          required
          type="password"
          minLength={8}
          placeholder="Password"
          value={auth.password}
          onChange={(e) => auth.setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
        />

        {auth.error && (
          <p role="alert" className="text-sm text-red-600">
            {auth.error}
          </p>
        )}

        <button
          type="submit"
          disabled={auth.loading}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {auth.loading
            ? "Please wait..."
            : auth.isRegistering
              ? "Create account"
              : "Sign in"}
        </button>

        <p className="text-center text-sm text-slate-600">
          {auth.isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={auth.toggleMode}
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            {auth.isRegistering ? "Sign in" : "Register"}
          </button>
        </p>
      </form>
    </main>
  );
}

export default Auth;