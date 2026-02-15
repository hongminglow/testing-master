import { useState, type FormEvent } from "react";

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
        className="p-6 rounded-xl border border-[rgba(63,185,80,0.3)] bg-[var(--accent-green-soft)] text-center"
      >
        <p className="text-[var(--accent-green)] font-semibold">
          ✓ Login successful!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="login-form"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-4"
      noValidate
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        Sign In
      </h3>

      {errors.form && (
        <div role="alert" className="p-3 rounded-lg bg-[var(--accent-red-soft)] text-[var(--accent-red)] text-sm">
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-[var(--accent-red)]">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-[var(--text-secondary)] mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-[var(--accent-red)]">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
