import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function Button({
  icon: Icon,
  onClick,
  variant = "default",
  size = "md",
  className,
  disabled = false,
  title,
  children,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-50",
  };

  const sizeStyles = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {Icon && <Icon size={size === "sm" ? 16 : size === "md" ? 20 : 24} />}
      {children}
    </button>
  );
}
