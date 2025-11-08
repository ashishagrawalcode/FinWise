import { Trophy, Star, Target, Flame } from "lucide-react";

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  category: "first-actions" | "milestones" | "mastery" | "special-events";
  isUnlocked: boolean;
  unlockedDate?: string;
  size?: "sm" | "md" | "lg";
}

const categoryColors = {
  "first-actions": "from-blue-400 to-blue-600",
  milestones: "from-green-400 to-green-600",
  mastery: "from-purple-400 to-purple-600",
  "special-events": "from-amber-400 to-amber-600",
};

const categoryIcons = {
  "first-actions": Trophy,
  milestones: Star,
  mastery: Target,
  "special-events": Flame,
};

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const sizeIconClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export function Badge({
  name,
  description,
  category,
  isUnlocked,
  unlockedDate,
  size = "md",
}: BadgeProps) {
  const Icon = categoryIcons[category];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center ${
          isUnlocked
            ? `bg-gradient-to-br ${categoryColors[category]} shadow-lg`
            : "bg-gray-300 dark:bg-gray-600"
        } transition-transform hover:scale-110 relative group`}
      >
        <Icon
          className={`${sizeIconClasses[size]} ${
            isUnlocked ? "text-white" : "text-gray-500"
          }`}
        />

        {isUnlocked && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary-600">✓</span>
          </div>
        )}

        {/* Tooltip on hover */}
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {name}
          {unlockedDate && (
            <div className="text-gray-400 text-xs mt-1">
              {new Date(unlockedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
