import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CharacterAvatar = ({ size = "md", className }: CharacterAvatarProps) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20",
        sizeClasses[size],
        className
      )}
    >
      <span role="img" aria-label="AI Agent">🤖</span>
    </div>
  );
};

export default CharacterAvatar;
