import React, { useState } from "react";
import { Pencil, Save , ArrowBigLeftIcon} from "lucide-react";
import { decryptApiKey, encryptApiKey } from './services/edgeCrypto.ts';

interface ProfilePageProps {
  user: any;
  encryptedApiKey: any;
//   decryptApiKey: (payload: any) => string;
//   encryptApiKey: (plain: string) => any;
  onSave: (encrypted: any) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  encryptedApiKey,
  onSave,
  onBack
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKeyPlain, setApiKeyPlain] = useState("");

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id}`;

  const handleEdit = async () => {
    setApiKeyPlain(await decryptApiKey(encryptedApiKey));
    setIsEditing(true);
  };

  const validateApiKey = (key: string) => {
    // Basic validation for API key format
    return /^AIzaSy[a-zA-Z0-9_-]{30,}$/.test(key);
  }

  const handleSave = async () => {
    if (!validateApiKey(apiKeyPlain)) { // Validate API key format
      alert("Invalid API Key format.");
      return;
    }
    const encrypted = await encryptApiKey(apiKeyPlain);
    onSave(encrypted);
    setIsEditing(false);
    setApiKeyPlain("");
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
        Profile
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
            {user?.email}
          </div>

          {/* API Key */}
          <div className="flex items-center gap-2 w-full">
            <input
              type={isEditing ? "text" : "password"}
              disabled={!isEditing}
              value={isEditing ? apiKeyPlain : "••••••••••••••••••••••"}
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
                          hover:bg-black/5 dark:hover:bg-white/10 transition text-slate-900 dark:text-slate-100"
                title="Edit API Key"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
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
        Save
      </button>
    </div>
  </div>
  );

};

export default ProfilePage;
