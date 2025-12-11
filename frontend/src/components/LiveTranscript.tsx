import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface LiveTranscriptProps {
  messages: Message[];
  personName: string;
}

const LiveTranscript = ({ messages, personName }: LiveTranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Your conversation will appear here...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 border border-border rounded-lg">
      <div className="p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-xs font-medium mb-1 opacity-70">
                {message.role === "user" ? "You" : personName}
              </p>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default LiveTranscript;
