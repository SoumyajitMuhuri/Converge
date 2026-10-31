import useAuth from "../hooks/useAuth";
import ThemeToggle from "../components/ui/ThemeToggle";

function Auth({ onLogin, theme, onToggleTheme }) {
  const auth = useAuth(onLogin);

  return (
    <main className="theme-page min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="" aria-hidden="true" className="h-9 w-12 object-contain" />
          <span className="theme-ink text-lg font-semibold tracking-tight">
            converge<span className="theme-accent-text">.</span>
          </span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 py-8 sm:py-12 lg:grid-cols-[1fr_0.92fr] lg:gap-20 lg:py-16">
        <section className="max-w-lg">
          <div className="theme-auth-mark mb-7" aria-hidden="true">
            <img src="/icon.png" alt="" className="h-full w-full rounded-[9px] object-contain" />
          </div>
          <p className="theme-accent-text text-xs font-semibold uppercase tracking-[0.16em]">
            Link management, made clear
          </p>
          <h1 className="theme-ink mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
            Make every link easier to share.
          </h1>
          <p className="theme-ink-secondary mt-5 max-w-md text-base leading-7">
            Create concise links, keep them organized, and see how people use
            them from one focused workspace.
          </p>
          <div className="theme-divider mt-8 flex items-center gap-3 border-t pt-5">
            <span className="theme-ink text-sm font-semibold">
              converge<span className="theme-accent-text">.</span>
            </span>
            <span className="theme-ink-muted text-sm">Simple links. Useful insight.</span>
          </div>
        </section>

        <section className="theme-surface w-full p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="theme-ink text-2xl font-semibold tracking-tight">
              {auth.isRegistering ? "Create your account" : "Welcome back"}
            </h2>
            <p className="theme-ink-secondary mt-2 text-sm leading-6">
              {auth.isRegistering
                ? "Add your details to get started."
                : "Sign in to continue to your workspace."}
            </p>
          </div>

          <form onSubmit={auth.handleSubmit} className="space-y-5">
            {auth.isRegistering && (
              <label className="theme-ink-secondary block text-sm font-medium">
                Full name
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={auth.name}
                  onChange={(event) => auth.setName(event.target.value)}
                  className="theme-control mt-2 h-11 w-full px-3.5 text-sm"
                />
              </label>
            )}

            <label className="theme-ink-secondary block text-sm font-medium">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                value={auth.email}
                onChange={(event) => auth.setEmail(event.target.value)}
                className="theme-control mt-2 h-11 w-full px-3.5 text-sm"
              />
            </label>

            <label className="theme-ink-secondary block text-sm font-medium">
              Password
              <input
                required
                type="password"
                minLength={8}
                autoComplete={auth.isRegistering ? "new-password" : "current-password"}
                value={auth.password}
                onChange={(event) => auth.setPassword(event.target.value)}
                className="theme-control mt-2 h-11 w-full px-3.5 text-sm"
              />
              {auth.isRegistering && (
                <span className="theme-ink-muted mt-2 block text-xs">
                  Use at least 8 characters.
                </span>
              )}
            </label>

            {auth.error && (
              <p role="alert" className="theme-alert-error px-3.5 py-3 text-sm">
                {auth.error}
              </p>
            )}

            <button
              type="submit"
              disabled={auth.loading}
              className="theme-primary-button w-full"
            >
              {auth.loading
                ? "Please wait…"
                : auth.isRegistering
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="theme-divider mt-6 border-t pt-5 text-center text-sm">
            <span className="theme-ink-secondary">
              {auth.isRegistering
                ? "Already have an account?"
                : "New to Converge?"}
            </span>{" "}
            <button
              type="button"
              onClick={auth.toggleMode}
              className="theme-accent-text rounded-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {auth.isRegistering ? "Sign in" : "Create an account"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Auth;
