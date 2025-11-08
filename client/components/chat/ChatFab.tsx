import { useState } from "react";
import { ChatCoach } from "@/components/chat/ChatCoach";
import { MessageCircle } from "lucide-react";

export function ChatFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[55] w-12 h-12 rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 transition-colors flex items-center justify-center"
        aria-label="Open AI Coach"
        title="AI Coach"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <ChatCoach controlledOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

