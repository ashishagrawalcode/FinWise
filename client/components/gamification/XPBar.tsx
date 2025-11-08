import { Zap } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  className?: string;
}

export function XPBar({ currentXP, maxXP, level, className = "" }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;
  const xpRemaining = maxXP - currentXP;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Level {level}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentXP} / {maxXP}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {xpRemaining} XP to next level
      </p>
    </div>
  );
}
