import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isActive: boolean;
  variant?: "user" | "agent";
}

const AudioWaveform = ({ isActive, variant = "user" }: AudioWaveformProps) => {
  const bars = 5;

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-150",
            isActive
              ? variant === "agent"
                ? "bg-primary animate-waveform"
                : "bg-muted-foreground animate-waveform"
              : "bg-muted h-2"
          )}
          style={{
            animationDelay: `${i * 100}ms`,
            height: isActive ? undefined : "8px",
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
