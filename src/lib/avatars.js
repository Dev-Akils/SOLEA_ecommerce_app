// Preset avatars — no file upload needed, just a set of themed picks
// that match the Solea maroon/gold aesthetic.
export const AVATAR_PRESETS = {
  runner: { emoji: "🏃", gradient: "from-amber-700/60 to-[#3A0F14]" },
  court: { emoji: "🏀", gradient: "from-amber-500/60 to-[#24080B]" },
  everyday: { emoji: "👟", gradient: "from-[#C4A77D] to-[#3A0F14]" },
  gold: { emoji: "⭐", gradient: "from-gold-500 to-[#24080B]" },
  flame: { emoji: "🔥", gradient: "from-red-700/70 to-[#1A0609]" },
  bolt: { emoji: "⚡", gradient: "from-amber-400/70 to-[#3A0F14]" },
};

export function getAvatar(id) {
  return AVATAR_PRESETS[id] || AVATAR_PRESETS.runner;
}