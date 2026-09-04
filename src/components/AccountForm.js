"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_PRESETS, getAvatar } from "@/lib/avatars";

export default function AccountForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || "runner");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Could not save changes");
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  const current = getAvatar(avatar);

  return (
    <form
      onSubmit={handleSave}
      className="bg-[#24080B] border border-amber-900/30 rounded-xl p-6 space-y-6"
    >
      {/* Current avatar preview */}
      <div className="flex items-center gap-4">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${current.gradient} flex items-center justify-center text-4xl shrink-0`}
        >
          {current.emoji}
        </div>
        <div>
          <p className="text-[#EBDCC6] font-serif italic text-lg">{name || user.name}</p>
          <p className="text-[#EBDCC6]/50 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Avatar picker */}
      <div>
        <p className="text-[#EBDCC6]/80 text-sm font-semibold mb-3 uppercase tracking-wide">
          Choose an avatar
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(AVATAR_PRESETS).map(([id, preset]) => (
            <button
              type="button"
              key={id}
              onClick={() => setAvatar(id)}
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-2xl transition-all ${
                avatar === id
                  ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-[#24080B] scale-110"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={id}
            >
              {preset.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-[#EBDCC6]/80 text-sm font-semibold mb-2 block uppercase tracking-wide">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1A0609] border border-amber-900/30 rounded px-3 py-2 text-[#EBDCC6] focus:outline-none focus:border-gold-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        disabled={saving}
        className="bg-gold-500 text-maroon-950 font-semibold px-6 py-2.5 rounded disabled:opacity-60"
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}