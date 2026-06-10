"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, CheckCircle } from "@/components/ui/animated-icons";
import { motion, AnimatePresence } from "framer-motion";

function inputCls(err?: boolean) {
  return `w-full bg-secondary border ${err ? "border-primary" : "border-border"} text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      supabase.from("profiles").select("full_name, phone").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) { setFullName(data.full_name ?? ""); setPhone(data.phone ?? ""); }
        });
    });
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: profileErr } = await supabase.from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", user.id);

    if (profileErr) { setError(profileErr.message); setSaving(false); return; }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>My Account</p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.2rem", letterSpacing: "0.02em" }} className="text-foreground uppercase">
          Profile
        </h1>
      </div>

      <div className="bg-card border border-border p-6">
        <form onSubmit={handleSave} className="space-y-5 max-w-md">
          <div>
            <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
              Full Name
            </label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Your full name" className={inputCls()} />
          </div>

          <div>
            <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
              Email
            </label>
            <input value={email} disabled
              className={inputCls() + " opacity-40 cursor-not-allowed"} />
            <p className="text-muted-foreground text-[10px] mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
              Phone
            </label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+92 300 0000000" className={inputCls()} />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-primary text-sm">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-primary transition-colors disabled:opacity-60 cursor-pointer"
            style={{ fontFamily: "var(--font-oswald)" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
