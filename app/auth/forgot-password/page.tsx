"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "@/components/ui/animated-icons";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";

const inputCls = (hasError: boolean) =>
  `w-full bg-background border ${hasError ? "border-primary" : "border-border"} focus:border-primary text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm outline-none transition-colors`;

const errCls = "text-primary text-[10px] mt-1.5";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div className="bg-card border border-border p-8">
        <div className="mb-7">
          <h1 className="text-foreground uppercase mb-1"
            style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
            Email Sent
          </h1>
          <p className="text-muted-foreground text-sm">
            A password reset link has been sent to{" "}
            <span className="text-foreground">{sentTo}</span>. Check your inbox.
          </p>
        </div>
        <Link href="/auth/login">
          <button
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-[0.25em] uppercase text-[11px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Back to Sign In
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-8">
      <div className="mb-7">
        <h1 className="text-foreground uppercase mb-1"
          style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-oswald)" }}>Email</label>
          <input
            type="email" placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
            className={inputCls(!!errors.email)}
          />
          {errors.email && <p className={errCls} role="alert">{errors.email.message}</p>}
        </div>

        {errors.root && (
          <p className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-3" role="alert">
            {errors.root.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-[0.25em] uppercase text-[11px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}>
          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
