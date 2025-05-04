import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
    children: ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.25 },
            }}>
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
