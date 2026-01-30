import React, { useState } from "react";
import { Pencil, Save , ArrowBigLeftIcon, Plus} from "lucide-react";
import { decryptApiKey, encryptApiKey} from './services/edgeCrypto.ts';
import { supabase } from "./services/supabaseClient";
import { AppLanguage, LANGUAGE_DATA } from "./lang/Language.tsx";

interface ProfilePageProps {
  user: any;
  encryptedApiKey: any;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSave: (encrypted: any) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  encryptedApiKey,
  language,
  onLanguageChange,
  onSave,
  onBack
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKeyPlain, setApiKeyPlain] = useState("");
  const hasApiKey = Boolean(encryptedApiKey);

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id}`;

  const handleEdit = async () => {
    if (!hasApiKey) {
      setApiKeyPlain("");
      setIsEditing(true);
      return;
    }
    try {
      setApiKeyPlain(await decryptApiKey(encryptedApiKey));
      setIsEditing(true);
    } catch (e) {
      console.error(e);
      alert(LANGUAGE_DATA[language].ui.failedToLoadApiKey);
    }
  };

  const validateApiKey = (key: string) => {
    // Basic validation for API key format
    return /^AIzaSy[a-zA-Z0-9_-]{30,}$/.test(key);
  }

  const handleSave = async () => {
    if (!validateApiKey(apiKeyPlain)) {
      alert(LANGUAGE_DATA[language].ui.invalidApiKeyFormat);
      return;
    }

    try {
      const encrypted = await encryptApiKey(apiKeyPlain);

      // ✅ Persist to DB
      const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        api_key: encrypted,
        mode: "full",
      });

      if (error) throw error;

      // 🔔 Notify App (runtime update)
      onSave(encrypted);

      setIsEditing(false);
      setApiKeyPlain("");
    } catch (err) {
      console.error(err);
      alert(LANGUAGE_DATA[language].ui.failedToSaveApiKey);
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
    {/* Back button */}
    <button
      onClick={onBack}
      className="
        absolute top-4 left-4
        text-slate-600 dark:text-slate-300
        hover:text-indigo-600 dark:hover:text-indigo-400
        transition-colors
      "
    >
      <ArrowBigLeftIcon size={20} />
    </button>

    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Title */}
      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {LANGUAGE_DATA[language].ui.profile}
      </div>

      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        {/* Avatar */}
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-24 h-24 rounded-full border border-black/10 dark:border-white/10"
        />

        {/* Info */}
        <div className="flex flex-col gap-3 w-full">
          {/* Email */}
          <div className="text-sm text-slate-600 dark:text-slate-300 break-all">
            {LANGUAGE_DATA[language].ui.email}: {user?.email}
          </div>

          {/* API Key */}
          <div className="flex items-center gap-2 w-full">
            <input
              type={isEditing ? "text" : "password"}
              disabled={!isEditing}
              value={isEditing ? apiKeyPlain : hasApiKey ? "••••••••••••••••••••••" : ""}
              placeholder={!hasApiKey && !isEditing ? LANGUAGE_DATA[language].ui.noApiKeySetMessage : undefined}
              onChange={(e) => setApiKeyPlain(e.target.value)}
              className="
                flex-1 px-3 py-2 rounded-lg
                bg-slate-100 dark:bg-slate-800
                border border-black/5 dark:border-white/10
                text-slate-900 dark:text-slate-100
                text-sm font-mono
                disabled:opacity-60
                min-w-0
              "
            />

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800
                          hover:bg-black/5 dark:hover:bg-white/10 transition
                          text-slate-900 dark:text-slate-100"
                title={hasApiKey ? LANGUAGE_DATA[language].ui.editApiKey : LANGUAGE_DATA[language].ui.addApiKey}
              >
                {hasApiKey ? <Pencil size={16} /> : <Plus size={16} />}
              </button>
            )}

          </div>
          {!hasApiKey && !isEditing && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {LANGUAGE_DATA[language].ui.noApiKeyAdded}
            </div>
          )}
        </div>
      </div>

      {/* Save button (no layout shift) */}
      <button
        onClick={handleSave}
        className={`
          flex items-center gap-2
          px-6 py-2 rounded-full
          bg-indigo-600 hover:bg-indigo-700
          text-white text-sm font-medium
          shadow-lg
          transition-all duration-200
          ${isEditing
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none translate-y-2"}
        `}
      >
        <Save size={16} />
        {LANGUAGE_DATA[language].ui.save}
      </button>
      {/* Settings */}
      <div className="w-full pt-4 border-t border-black/5 dark:border-white/10">
       <div className="flex flex-col items-center min-w-max">
        <div className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-5">
          {LANGUAGE_DATA[language].ui.settings}
        </div>
       

        <div className="flex max-w-xs">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 mx-5">
            {LANGUAGE_DATA[language].ui.language}
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
            className="
              px-3 py-2 rounded-lg
              bg-slate-100 dark:bg-slate-800
              text-slate-900 dark:text-slate-200
              border border-black/5 dark:border-white/10
              text-sm min-w-max
            "
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
        </div>
      </div>

    </div>
  </div>
  );

};

export default ProfilePage;
