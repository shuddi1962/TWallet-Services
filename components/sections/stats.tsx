"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { useInView } from "@/lib/hooks/use-in-view";

const stats = [
  { value: 10000, suffix: "+", label: "Active cards", prefix: "" },
  { value: 7, suffix: "", label: "EVM networks", prefix: "" },
  { value: 150, suffix: "+", label: "Countries supported", prefix: "" },
  { value: 100, suffix: "M+", label: "Merchants worldwide", prefix: "" },
  { value: 5, suffix: "min", label: "Average verification", prefix: "<" },
  { value: 0, suffix: "", label: "Keys collected", prefix: "" },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const { ref, inView } = useInView({ threshold: 0.5 });

  return (
    <div ref={ref} className="relative">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl font-bold text-gradient"
      >
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </motion.span>
    </div>
  );
}

export function Stats() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="border-y border-white/5 py-16">
      <Container>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <div className="mt-1 text-sm text-surface-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
