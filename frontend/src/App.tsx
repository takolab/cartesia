import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VoiceAgentInput from "./pages/VoiceAgentInput";
import LoadingPage from "./pages/LoadingPage";
import ConversationPage from "./pages/ConversationPage";
import EndPage from "./pages/EndPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VoiceAgentInput />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/end" element={<EndPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
