import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quote, RotateCcw, Download } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const MOTIVATIONAL_QUOTES = [
  "The best way to predict the future is to invent it.",
  "Innovation distinguishes between a leader and a follower.",
  "The only way to do great work is to love what you do.",
  "Stay hungry, stay foolish.",
  "Technology is best when it brings people together.",
];

const EndPage = () => {
  const navigate = useNavigate();
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<Message[]>([]);

  const agentName = "AI Assistant";

  useEffect(() => {
    const savedTranscript = sessionStorage.getItem("conversationTranscript");
    if (savedTranscript) {
      try {
        setTranscript(JSON.parse(savedTranscript));
      } catch (e) {
        console.error("Failed to parse transcript:", e);
      }
    }
  }, []);

  const handleNewConversation = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const downloadTranscript = () => {
    const text = transcript
      .map((m) => `${m.role === "user" ? "You" : agentName}: ${m.text}`)
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8">
        {/* Thank you message */}
        <div className="text-center space-y-6">
          <CharacterAvatar size="lg" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Thanks for chatting!</h1>
            <p className="text-muted-foreground text-lg">
              Hope you enjoyed your conversation with {agentName}
            </p>
          </div>
        </div>

        {/* Quote card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Quote className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-lg italic">"{quote}"</p>
                <p className="text-sm text-muted-foreground">— Inspiring Words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcript section */}
        {transcript.length > 0 && (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full"
            >
              {showTranscript ? "Hide" : "View"} Conversation Transcript
            </Button>

            {showTranscript && (
              <Card>
                <CardContent className="pt-4">
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {transcript.map((message, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {message.role === "user" ? "You" : agentName}
                          </p>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadTranscript}
                    className="mt-4 w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Transcript
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <Button onClick={handleNewConversation} className="w-full h-12">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start a New Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndPage;
