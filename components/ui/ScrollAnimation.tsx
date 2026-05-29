"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
}

export default function ScrollAnimation({
    children,
    className = "",
}: ScrollAnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
