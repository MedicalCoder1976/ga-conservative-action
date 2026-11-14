import React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-slate-600 text-white hover:bg-slate-800 font-bold",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  ghost: "hover:bg-slate-800 text-white",
  destructive: "bg-red-600 hover:bg-red-700 text-white",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeVariants = {
  default: "h-9 px-3 py-1 text-sm",
  sm: "h-8 px-2 text-xs",
  lg: "h-11 px-4 text-base font-bold",
  icon: "h-9 w-9",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof sizeVariants
  disabled?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
