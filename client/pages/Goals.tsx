import { useState } from "react";
import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";
import type { Goal } from "@shared/api";
import { Plus, Trash2 } from "lucide-react";

export default function Goals() {
  const [authState] = useAuth();
  const { state, isLoaded, addGoal, updateGoal, removeGoal } = useFinancialState(authState.user?.email || "");

  const [newGoal, setNewGoal] = useState({
    name: "",
    type: "emergency" as Goal["type"],
    target: 50000,
    current: 0,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium" as const,
    monthlyCommitment: 5000,
  });

  if (!isLoaded) return <div className="p-8 text-center">Loading goals…</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Goals</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Track, update, and achieve your financial goals</p>
          </div>
        </div>

        {/* Add Goal */}
        <div className="card-base mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Goal name (e.g., Emergency Fund)"
              value={newGoal.name}
              onChange={(e) => setNewGoal((p) => ({ ...p, name: e.target.value }))}
              className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal((p) => ({ ...p, type: e.target.value as Goal["type"] }))}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="emergency">Emergency</option>
              <option value="debt">Debt</option>
              <option value="purchase">Purchase</option>
              <option value="education">Education</option>
              <option value="retirement">Retirement</option>
            </select>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal((p) => ({ ...p, target: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder="Target ₹"
            />
            <input
              type="number"
              value={newGoal.current}
              onChange={(e) => setNewGoal((p) => ({ ...p, current: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder="Current ₹"
            />
            <input
              type="date"
              value={new Date(newGoal.deadline).toISOString().slice(0, 10)}
              onChange={(e) => setNewGoal((p) => ({ ...p, deadline: new Date(e.target.value).toISOString() }))}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => {
                if (!newGoal.name.trim() || newGoal.target <= 0) return;
                addGoal(newGoal);
                setNewGoal({
                  name: "",
                  type: "emergency",
                  target: 50000,
                  current: 0,
                  deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                  priority: "medium",
                  monthlyCommitment: 5000,
                });
              }}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Note: Goals are interlinked with accounts. Funding or progress updates can draw from your accounts in future iterations.</p>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {state.goals.length === 0 && (
            <div className="card-base">
              <p className="text-sm text-gray-600 dark:text-gray-400">No goals yet. Create your first goal above.</p>
            </div>
          )}
          {state.goals.map((g) => {
            const progress = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div key={g.id} className="card-base">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{g.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Target ₹{g.target.toLocaleString("en-IN")} • Due {new Date(g.deadline).toLocaleDateString("en-IN")}</p>
                  </div>
                  <button onClick={() => removeGoal(g.id)} className="text-red-600 text-sm font-semibold flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">₹{g.current.toLocaleString("en-IN")} / ₹{g.target.toLocaleString("en-IN")}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-success" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    defaultValue={g.current}
                    onBlur={(e) => updateGoal(g.id, { current: parseFloat(e.target.value) || 0 })}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                  <select
                    defaultValue={g.priority}
                    onChange={(e) => updateGoal(g.id, { priority: e.target.value as Goal["priority"] })}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <input
                    type="date"
                    defaultValue={new Date(g.deadline).toISOString().slice(0, 10)}
                    onChange={(e) => updateGoal(g.id, { deadline: new Date(e.target.value).toISOString() })}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
