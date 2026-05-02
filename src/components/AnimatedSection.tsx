"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedSection({ children, className, id, delay = 0 }: { children: ReactNode, className?: string, id?: string, delay?: number }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedText({ text, className, smoke = false }: { text: string, className?: string, smoke?: boolean }) {
  const words = text.split(" ");
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: smoke ? 0.15 : 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        damping: smoke ? 25 : 12, 
        stiffness: smoke ? 80 : 100, 
        duration: smoke ? 1.5 : undefined 
      },
    },
    hidden: {
      opacity: 0,
      y: smoke ? 20 : 50,
      filter: smoke ? "blur(12px)" : "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
