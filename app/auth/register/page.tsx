"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "@/components/ui/animated-icons";
import { useState } from "react";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

const inputCls = (hasError: boolean) =>
  `w-full bg-background border ${hasError ? "border-primary" : "border-border"} focus:border-primary text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm outline-none transition-colors`;

const errCls = "text-primary text-[10px] mt-1.5";

export default function RegisterPage() {
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    setSuccess(values.email);
  }

  if (success) {
    return (
      <div className="bg-card border border-border p-8">
        <div className="mb-7">
          <h1 className="text-foreground uppercase mb-1"
            style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
            Check Your Email
          </h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a confirmation link to{" "}
            <span className="text-foreground">{success}</span>. Click it to activate your account.
          </p>
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-[0.25em] uppercase text-[11px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-8">
      <div className="mb-7">
        <h1 className="text-foreground uppercase mb-1"
          style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
          Create Account
        </h1>
        <p className="text-muted-foreground text-sm">Join HUSTLERS and start your fitness journey.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-oswald)" }}>Full Name</label>
          <input
            type="text" placeholder="John Doe"
            aria-invalid={!!errors.full_name}
            {...register("full_name")}
            className={inputCls(!!errors.full_name)}
          />
          {errors.full_name && <p className={errCls} role="alert">{errors.full_name.message}</p>}
        </div>
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
        <div>
          <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-oswald)" }}>Password</label>
          <input
            type="password" placeholder="Min. 8 characters"
            aria-invalid={!!errors.password}
            {...register("password")}
            className={inputCls(!!errors.password)}
          />
          {errors.password && <p className={errCls} role="alert">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <p className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-3" role="alert">
            {errors.root.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-[0.25em] uppercase text-[11px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}>
          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Create Account"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
