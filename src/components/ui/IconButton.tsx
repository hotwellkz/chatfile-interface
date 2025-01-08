import React from 'react';
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          "hover:bg-accent",
          className
        )}
        {...props}
      >
        {children}
        {title && <span className="sr-only">{title}</span>}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";