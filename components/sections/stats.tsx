"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

const stats = [
  { value: 50000, suffix: "+", label: "Cards Delivered", prefix: "" },
  { value: 120, suffix: "+", label: "Countries", prefix: "" },
  { value: 99.9, suffix: "%", label: "Success Rate", prefix: "", decimals: 1 },
  { value: 24, suffix: "/7", label: "Support", prefix: "" },
];

function AnimatedCounter({ value, suffix, prefix, decimals = 0 }: { value: number; suffix: string; prefix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const observer = new IntersectionObserver(
            ([entry]) => { if (entry?.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold: 0.5 },
          );
          observer.observe(ref);
        }
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl font-bold text-gradient-blue sm:text-5xl"
      >
        {prefix}
        {count.toLocaleString(undefined, { maximumFractionDigits: decimals })}
        {suffix}
      </motion.span>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative py-16 lg:py-20 bg-surface-50 border-y border-surface-200">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} decimals={stat.decimals} />
              <div className="mt-1.5 text-sm font-medium text-surface-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
