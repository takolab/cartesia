import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";

const VoiceAgentInput = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!input.trim()) return;

    // Store input in sessionStorage for the next pages
    sessionStorage.setItem("voiceAgentInput", input.trim());
    navigate("/loading");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Voice AI Agent
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a conversation with an AI agent powered by Cartesia
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="input" className="text-sm font-medium text-foreground">
              What would you like to talk about?
            </label>
            <Textarea
              id="input"
              placeholder='Example: "I want to discuss the future of AI technology"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px] text-base resize-none"
            />
          </div>

          <Button
            onClick={handleStart}
            disabled={!input.trim()}
            className="w-full h-12 text-base font-medium"
          >
            Start Conversation
          </Button>
        </div>

        {/* Example prompts */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Try these examples:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Discuss AI and machine learning",
              "Talk about creative writing",
              "Explore science and technology",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentInput;
