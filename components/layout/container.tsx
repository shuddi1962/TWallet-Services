import { cn } from "@/lib/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Container({
  className,
  size = "lg",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-3xl": size === "sm",
          "max-w-5xl": size === "md",
          "max-w-7xl": size === "lg",
          "max-w-screen-2xl": size === "xl",
        },
        className,
      )}
      {...props}
    />
  );
}
