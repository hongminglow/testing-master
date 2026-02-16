import { useState, type FormEvent } from "react";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
}

/**
 * A login form with validation.
 * Used to showcase: form interaction, async submission,
 * validation error display, loading states.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
      setSuccess(true);
      setEmail("");
      setPassword("");
      setErrors({});
    } catch {
      setErrors({ form: "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        data-testid="success-message"
        className="p-6 rounded-xl border border-[var(--accent-green-border)] bg-[var(--accent-green-soft)] text-center animate-fade-in"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--accent-green-border)] bg-[rgba(52,211,153,0.1)] mb-3 mx-auto">
          <CheckCircle className="w-6 h-6 text-[var(--accent-green)]" />
        </div>
        <p className="text-[var(--accent-green)] font-semibold text-lg">
          Login successful!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="login-form"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm space-y-4"
      noValidate
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
          Sign In
        </h3>
        <span className="text-xs text-[var(--text-muted)] italic">
          Try any valid email
        </span>
      </div>

      {errors.form && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-lg bg-[var(--accent-red-soft)] border border-[var(--accent-red-border)] text-[var(--accent-red)] text-sm animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.form}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
        >
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--bg-input)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-elevated)] transition-all ${
              errors.email
                ? "border-[var(--accent-red)] focus:ring-1 focus:ring-[var(--accent-red)]"
                : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            }`}
          />
        </div>
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 text-xs text-[var(--accent-red)] flex items-center gap-1 animate-fade-in"
          >
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
        >
          Password
        </label>
        <div className="relative group">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--bg-input)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-elevated)] transition-all ${
              errors.password
                ? "border-[var(--accent-red)] focus:ring-1 focus:ring-[var(--accent-red)]"
                : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            }`}
          />
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-1 text-xs text-[var(--accent-red)] flex items-center gap-1 animate-fade-in"
          >
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-glow)] mt-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
