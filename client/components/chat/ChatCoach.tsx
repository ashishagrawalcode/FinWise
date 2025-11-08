import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";
import { MessageSquare, X, Send } from "lucide-react";

export function ChatCoach({ controlledOpen, onClose }: { controlledOpen?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const [authState] = useAuth();
  const { state, isLoaded, sendCoachMessage } = useFinancialState(authState.user?.email || "");
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, state.chatHistory.length]);

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    // Try server AI first
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        // Persist both messages with correct roles
        sendCoachMessage(text, "user");
        if (data.reply) {
          sendCoachMessage(data.reply, "assistant");
        }
      } else {
        // Fallback: local rule-based generates assistant reply automatically
        sendCoachMessage(text, "user");
      }
    } catch {
      sendCoachMessage(text, "user");
    }
    setInput("");
  };

  const isOpen = controlledOpen ?? open;

  return (
    <div>
      {/* Trigger in header area: render a compact button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-slate-700 transition-colors"
        title="Chat with Coach"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-semibold">Coach</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => (onClose ? onClose() : setOpen(false))} />
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg text-white flex items-center justify-center font-bold">🤖</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">AI Coach</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ask about accounts, goals, budgets</p>
                </div>
              </div>
              <button onClick={() => (onClose ? onClose() : setOpen(false))} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {!isLoaded && <p className="text-sm text-center text-gray-500">Loading chat…</p>}
              {isLoaded && state.chatHistory.length === 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>Hi! I can help you with:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Net worth and account balances</li>
                    <li>Creating and tracking goals</li>
                    <li>Budgeting and transactions</li>
                  </ul>
                </div>
              )}
              {state.chatHistory.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      m.role === "user"
                        ? "bg-primary-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder="Type your message…"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <button onClick={onSend} className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
