"use client";

import { cn } from "@/lib/utils";

const calculateStrength = (password) => {
  if (!password) return { score: 0, level: "empty" };

  let score = 0;

  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let level = "empty";

  if (score <= 2) level = "weak";
  else if (score <= 4) level = "medium";
  else if (score <= 5) level = "strong";
  else level = "very-strong";

  return { score, level };
};

const strengthColors = {
  empty: "bg-muted",
  weak: "bg-red-500",
  medium: "bg-orange-500",
  strong: "bg-green-500",
  "very-strong": "bg-emerald-500",
};

export function PasswordStrengthBar({
  password,
  showLabel = true,
}) {
  const { score, level } = calculateStrength(password);

  const activeBars = Math.min(Math.ceil(score / 1.5), 4);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < activeBars
                ? strengthColors[level]
                : "bg-muted"
            )}
          />
        ))}
      </div>

      {showLabel && password && (
        <p
          className={cn(
            "text-xs",
            level === "weak" && "text-red-500",
            level === "medium" && "text-orange-500",
            level === "strong" && "text-green-500",
            level === "very-strong" && "text-emerald-500"
          )}
        >
          {level.replace("-", " ")}
        </p>
      )}
    </div>
  );
}