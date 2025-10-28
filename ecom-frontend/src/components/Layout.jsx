import React, { useEffect, useState } from "react";
import Particles from "./Particles";

const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const html = document.documentElement;
    return html.classList.contains('dark') || localStorage.getItem('theme') === 'dark-theme';
  });

  useEffect(() => {
    const handler = (e) => {
      const next = e?.detail || localStorage.getItem('theme');
      setIsDark(next === 'dark-theme' || document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('theme-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('theme-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      {isDark && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Particles
            particleColors={["#ffffff", "#a78bfa", "#818cf8"]}
            particleCount={180}
            particleSpread={10}
            speed={0.08}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>
      )}
      <main className="flex-1">{children}</main>
      <footer className="py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Online-Basket Shop — Modernized UI
      </footer>
    </div>
  );
};

export default Layout;
