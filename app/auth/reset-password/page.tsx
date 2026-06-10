"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "@/components/ui/animated-icons";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";

const inputCls = (hasError: boolean) =>
  `w-full bg-background border ${hasError ? "border-primary" : "border-border"} focus:border-primary text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm outline-none transition-colors`;

const errCls = "text-primary text-[10px] mt-1.5";

export default function ResetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="bg-card border border-border p-8">
      <div className="mb-7">
        <h1 className="text-foreground uppercase mb-1"
          style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.04em" }}>
          Set New Password
        </h1>
        <p className="text-muted-foreground text-sm">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-oswald)" }}>New Password</label>
          <input
            type="password" placeholder="Min. 8 characters"
            aria-invalid={!!errors.password}
            {...register("password")}
            className={inputCls(!!errors.password)}
          />
          {errors.password && <p className={errCls} role="alert">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-oswald)" }}>Confirm Password</label>
          <input
            type="password" placeholder="Repeat password"
            aria-invalid={!!errors.confirm}
            {...register("confirm")}
            className={inputCls(!!errors.confirm)}
          />
          {errors.confirm && <p className={errCls} role="alert">{errors.confirm.message}</p>}
        </div>

        {errors.root && (
          <p className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-3" role="alert">
            {errors.root.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-[0.25em] uppercase text-[11px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}>
          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
