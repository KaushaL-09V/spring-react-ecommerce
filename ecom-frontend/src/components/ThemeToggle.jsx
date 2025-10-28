import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = ({ className = "" }) => {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    return stored ? stored : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply theme classes safely without wiping other classes
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove('dark-theme', 'light-theme');
    html.classList.add(theme);

    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(theme);

    // Toggle Tailwind's dark variant class
    if (theme === 'dark-theme') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Set CSS variables programmatically for immediate effect
    const root = document.documentElement;
    if (theme === "dark-theme") {
      root.style.setProperty('--root_background', '#0b1020');
      root.style.setProperty('--text-color', '#f8fafc');
      root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.04)');
    } else {
      root.style.setProperty('--root_background', '#f8fafc');
      root.style.setProperty('--text-color', '#0f172a');
      root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.06)');
    }

    // Notify listeners (e.g., Layout) that theme changed
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 bg-white/10 dark:bg-slate-800/50 hover:bg-white/20 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {theme === "dark-theme" ? (
          <motion.div
            key="sun"
            initial={{ y: -20, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 20, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <FiSun size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 20, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <FiMoon size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
