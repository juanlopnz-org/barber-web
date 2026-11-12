import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-chrome text-[#0a0d12] shadow-chrome hover:-translate-y-0.5 hover:brightness-[1.06]": variant === "default",
            "border border-white/10 bg-white/[0.06] text-foreground hover:border-white/20 hover:bg-white/[0.12]": variant === "secondary",
            "border border-white/15 bg-transparent text-foreground hover:border-white/30 hover:bg-white/[0.07]": variant === "outline",
            "text-muted-foreground hover:bg-white/[0.08] hover:text-foreground": variant === "ghost",
            "h-11 px-5 py-2.5": size === "default",
            "h-9 rounded-xl px-3 text-xs": size === "sm",
            "h-12 rounded-2xl px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
