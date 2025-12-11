import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, Volume2 } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import AudioWaveform from "@/components/AudioWaveform";
import LiveTranscript from "@/components/LiveTranscript";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const ConversationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const input = sessionStorage.getItem("voiceAgentInput") || "";
  const agentName = "AI Assistant";

  // ElevenLabs agent configuration - use workflow-generated ID or fallback to default
  const DEFAULT_AGENT_ID = "agent_9301kc7b1k14f5wv01kazanwv5hs";
  const AGENT_ID = sessionStorage.getItem("agentId") || DEFAULT_AGENT_ID;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      setIsConnecting(false);
      setHasStarted(true);
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
    },
    onMessage: (message: unknown) => {
      console.log("Message received:", message);
      const msg = message as Record<string, unknown>;
      if (msg.type === "user_transcript") {
        const event = msg.user_transcription_event as { user_transcript: string } | undefined;
        if (event?.user_transcript) {
          setMessages(prev => [...prev, {
            role: "user",
            text: event.user_transcript
          }]);
        }
      } else if (msg.type === "agent_response") {
        const event = msg.agent_response_event as { agent_response: string } | undefined;
        if (event?.agent_response) {
          setMessages(prev => [...prev, {
            role: "assistant",
            text: event.agent_response
          }]);
        }
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to voice agent. Please try again.",
      });
      setIsConnecting(false);
    },
  });

  useEffect(() => {
    if (!input) {
      navigate("/");
    }
  }, [input, navigate]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with the agent ID directly
      // In production, you should get a signed URL from your backend
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    } catch (error: any) {
      console.error("Failed to start conversation:", error);

      // Handle specific error types
      let errorMessage = "Could not start conversation";
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Microphone permission denied. Please allow microphone access to continue.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No microphone found. Please connect a microphone and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Failed to Start Conversation",
        description: errorMessage,
      });
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    // Store transcript for end page
    sessionStorage.setItem("conversationTranscript", JSON.stringify(messages));
    navigate("/end");
  }, [conversation, messages, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CharacterAvatar size="sm" />
            <div>
              <h1 className="font-semibold">{agentName}</h1>
              <p className="text-sm text-muted-foreground">
                {conversation.status === "connected" ? "Connected" : "Ready to connect"}
              </p>
            </div>
          </div>
          {hasStarted && (
            <Button variant="destructive" size="sm" onClick={endConversation}>
              <Phone className="w-4 h-4 mr-2" />
              End Call
            </Button>
          )}
        </div>
      </header>

      {/* Main conversation area */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
        {!hasStarted ? (
          /* Pre-connection state */
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <CharacterAvatar size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{agentName}</h2>
              <p className="text-muted-foreground">Ready to have a conversation</p>
            </div>
            <Button
              size="lg"
              onClick={startConversation}
              disabled={isConnecting}
              className="h-14 px-8 text-lg"
            >
              {isConnecting ? (
                <>Connecting...</>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Talking
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Active conversation state */
          <div className="flex-1 flex flex-col space-y-6">
            {/* Waveform visualization */}
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-8">
                {/* User waveform */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    {conversation.status === "connected" && !conversation.isSpeaking ? (
                      <Mic className="w-6 h-6 text-primary" />
                    ) : (
                      <MicOff className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">You</p>
                  <AudioWaveform isActive={conversation.status === "connected" && !conversation.isSpeaking} />
                </div>

                {/* Connection indicator */}
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        conversation.status === "connected"
                          ? "bg-primary animate-pulse"
                          : "bg-muted"
                      }`}
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>

                {/* Agent waveform */}
                <div className="text-center space-y-2">
                  <CharacterAvatar size="md" />
                  <p className="text-xs text-muted-foreground">{agentName}</p>
                  <AudioWaveform isActive={conversation.isSpeaking} variant="agent" />
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                {conversation.isSpeaking ? (
                  <>
                    <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm">{agentName} is speaking...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="text-sm">Listening to you...</span>
                  </>
                )}
              </div>
            </div>

            {/* Live transcript */}
            <LiveTranscript messages={messages} personName={agentName} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ConversationPage;
