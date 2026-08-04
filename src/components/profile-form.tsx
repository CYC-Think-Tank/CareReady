"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function ProfileForm({
  viewerId,
  initialName,
  initialProfession,
}: {
  viewerId: string | null;
  initialName: string;
  initialProfession: string;
}) {
  const [fullName, setFullName] = useState(initialName);
  const [profession, setProfession] = useState(initialProfession);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    if (!viewerId || !isSupabaseConfigured()) {
      setStatus("Profile changes are disabled in preview mode.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, profession, updated_at: new Date().toISOString() })
      .eq("id", viewerId);
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName, profession },
    });

    setStatus(profileError || authError ? "Profile could not be saved." : "Profile saved.");
    setSaving(false);
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <div>
        <label htmlFor="profile-name" className="field-label">Full name</label>
        <input
          id="profile-name"
          className="text-field"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="profile-profession" className="field-label">Role</label>
        <select
          id="profile-profession"
          className="text-field"
          value={profession}
          onChange={(event) => setProfession(event.target.value)}
        >
          <option>Personal Support Worker</option>
          <option>Nurse</option>
          <option>Healthcare aide</option>
          <option>Community support worker</option>
          <option>Supervisor or educator</option>
          <option>Other healthcare professional</option>
        </select>
      </div>
      {status && (
        <p className="border-l-4 border-blue bg-blue/10 p-3 text-sm font-semibold text-ink/65" role="status">
          {status}
        </p>
      )}
      <button type="submit" className="button-primary justify-self-start" disabled={saving}>
        {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}
        Save profile
      </button>
    </form>
  );
}

