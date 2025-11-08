import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";

export default function Leaderboard() {
  const [authState] = useAuth();
  const { state } = useFinancialState(authState.user?.email || "");

  const demoPlayers = [
    { name: "You", xp: state.user.xp, netWorth: state.financialHub.netWorth },
    { name: "Aarav", xp: 1850, netWorth: 350000 },
    { name: "Diya", xp: 1620, netWorth: 280000 },
    { name: "Kabir", xp: 1430, netWorth: 190000 },
    { name: "Isha", xp: 1200, netWorth: 220000 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">Leaderboard</h1>
        <div className="space-y-3">
          {demoPlayers.map((p, idx) => (
            <div key={p.name} className="card-base flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Net Worth ₹{p.netWorth.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="text-primary-600 dark:text-primary-400 font-bold">{p.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Note: This is a demo leaderboard. Connect friends or teams later to compete.</p>
      </div>
    </div>
  );
}

