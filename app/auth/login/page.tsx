"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "@/components/ui/animated-icons";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

const inputCls = (hasError: boolean) =>
  `w-full bg-background border ${hasError ? "border-primary" : "border-border"} focus:border-primary text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm outline-none transition-colors`;

const errCls = "text-primary text-[10px] mt-1.5";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="bg-card border border-border p-8">
      <div className="mb-7">
        <h1 className="text-foreground uppercase mb-1"
          style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
          Sign In
        </h1>
        <p className="text-muted-foreground text-sm">Welcome back. Enter your credentials to continue.</p>
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-oswald)" }}>Password</label>
            <Link href="/auth/forgot-password" className="text-[10px] text-primary hover:underline tracking-wide">
              Forgot password?
            </Link>
          </div>
          <input
            type="password" placeholder="••••••••"
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
          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Sign In"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-card border border-border p-8 h-80 animate-pulse" />
    }>
      <LoginForm />
    </Suspense>
  );
}
