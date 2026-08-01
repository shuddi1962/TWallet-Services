declare module "framer-motion" {
  import type { ReactNode, CSSProperties } from "react";

  type TransformProperties = Record<string, string | number>;
  type AnimationProps = {
    initial?: string | Record<string, unknown>;
    animate?: string | Record<string, unknown>;
    exit?: string | Record<string, unknown>;
    variants?: Record<string, unknown> | { [key: string]: Record<string, unknown> };
    transition?: Record<string, unknown>;
    whileHover?: Record<string, unknown>;
    whileTap?: Record<string, unknown>;
    whileInView?: Record<string, unknown>;
    onAnimationComplete?: () => void;
    layout?: boolean | "position" | "size" | "preserve-aspect";
    layoutId?: string;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    key?: string | number;
    ref?: unknown;
    [key: string]: unknown;
  };

  export class motion {
    static div: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLDivElement>>;
    static span: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLSpanElement>>;
    static button: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLButtonElement>>;
    static a: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLAnchorElement>>;
    static img: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLImageElement>>;
    static p: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLParagraphElement>>;
    static h1: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLHeadingElement>>;
    static h2: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLHeadingElement>>;
    static h3: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLHeadingElement>>;
    static section: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLElement>>;
    static svg: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<SVGSVGElement>>;
    [key: string]: React.ForwardRefExoticComponent<AnimationProps & React.RefAttributes<HTMLElement>>;
  }

  export function AnimatePresence(props: { children?: ReactNode; mode?: "wait" | "sync" | "popLayout"; initial?: boolean; onExitComplete?: () => void; custom?: number }): JSX.Element;

  export function useAnimation(): { start: (animation: Record<string, unknown>) => void; stop: () => void };

  export function useMotionValue(value: number): { get: () => number; set: (v: number) => void };

  export function useTransform(source: unknown, input: number[], output: unknown[]): unknown;

  export function useScroll(): { scrollY: { get: () => number } };

  export function useSpring(source: unknown, config?: Record<string, unknown>): unknown;

  export function isValidMotionProp(key: string): boolean;
}

declare module "tailwind-merge" {
  export function twMerge(...inputs: (string | undefined | null | false)[]): string;
  export function twJoin(...inputs: (string | undefined | null | false)[]): string;
}
