import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { startWorkflow, getWorkflowStatus } from "@/api/workflowApi";
import { useToast } from "@/hooks/use-toast";

const LoadingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dots, setDots] = useState("");
  const [statusMessage, setStatusMessage] = useState("Initializing your agent...");

  const input = sessionStorage.getItem("voiceAgentInput") || "";

  // Agent name
  const agentName = "AI Assistant";

  useEffect(() => {
    // Redirect if no input
    if (!input) {
      navigate("/");
      return;
    }

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    // Start workflow and poll for completion
    let pollInterval: ReturnType<typeof setInterval>;

    const initializeWorkflow = async () => {
      try {
        setStatusMessage("Starting workflow...");

        // Start the workflow
        const { workflowId } = await startWorkflow({ user_query: input });
        sessionStorage.setItem("workflowId", workflowId);

        setStatusMessage("Preparing your AI agent...");

        // Poll for workflow status
        pollInterval = setInterval(async () => {
          try {
            const status = await getWorkflowStatus(workflowId);

            if (status.status === "ready" && status.eleven_labs_agent_id) {
              clearInterval(pollInterval);
              // Store agent ID for conversation page
              sessionStorage.setItem("agentId", status.eleven_labs_agent_id);
              setStatusMessage("Agent ready! Redirecting...");

              setTimeout(() => {
                navigate("/conversation");
              }, 500);
            } else if (status.status === "failed") {
              clearInterval(pollInterval);
              throw new Error("Workflow failed to initialize");
            }
            // If pending, continue polling
          } catch (error: any) {
            clearInterval(pollInterval);
            console.error("Workflow status error:", error);
            toast({
              variant: "destructive",
              title: "Workflow Status Error",
              description: error.userMessage || "Failed to prepare agent. Using default configuration.",
            });
            // Fallback to conversation page without custom agent
            setTimeout(() => navigate("/conversation"), 1000);
          }
        }, 1000); // Poll every second

      } catch (error: any) {
        console.error("Workflow initialization error:", error);
        toast({
          variant: "destructive",
          title: "Workflow Initialization Error",
          description: error.userMessage || "Failed to start workflow. Using default configuration.",
        });
        // Fallback to conversation page without custom agent
        setTimeout(() => navigate("/conversation"), 1000);
      }
    };

    initializeWorkflow();

    return () => {
      clearInterval(dotsInterval);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [input, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Animated loader */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-primary/20 animate-pulse" />
        </div>

        {/* Loading messages */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            {statusMessage}{dots}
          </h1>
          <p className="text-lg text-muted-foreground">
            Sit tight and get ready to talk to <span className="text-primary font-semibold">{agentName}</span>
          </p>
        </div>

        {/* Excitement prompt */}
        <div className="pt-4">
          <p className="text-xl font-medium text-foreground">
            Ready to have an amazing conversation?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Preparing your personalized conversation experience...
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
