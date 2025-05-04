import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
    children: ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ height: "100%" }}>
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
