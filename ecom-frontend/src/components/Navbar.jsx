import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Theme is handled globally by ThemeToggle; no local theme side-effects here

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setIsLoading(true);
    setIsNavOpen(false);
    try {
      const response = await axios.get(`${baseUrl}/api/products/search?keyword=${input}`);
      if (response.data && response.data.length > 0) {
        navigate(`/search-results`, { state: { searchData: response.data } });
      } else {
        // show no results briefly using toast or inline message
        navigate(`/search-results`, { state: { searchData: [] } });
      }
    } catch (error) {
      console.error("Error searching:", error);
      navigate(`/search-results`, { state: { searchData: [] } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    setIsNavOpen(false);
  };

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-white/80 dark:from-slate-900/80 to-transparent backdrop-blur-md border-b border-slate-200/30 dark:border-slate-700/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Online-Basket</a>
            <nav className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate('/')} className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Home</button>
              <button onClick={() => navigate('/add_product')} className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Add Product</button>
              <button onClick={() => navigate('/orders')} className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Orders</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit} className="hidden sm:flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 transition-colors">
              <input
                type="search"
                placeholder="Search products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent outline-none text-sm w-56 dark:text-slate-200 dark:placeholder-slate-400"
              />
              <button type="submit" className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                {isLoading ? <span className="loader inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"/> : <FiSearch />}
              </button>
            </form>

            <button onClick={() => navigate('/cart')} className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 hidden md:inline-flex transition-colors">Cart</button>

            <ThemeToggle />

            <div className="md:hidden">
              <button onClick={() => setIsNavOpen((s) => !s)} className="p-2 rounded-md dark:text-slate-200">
                {isNavOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/30 dark:border-slate-700/30"
            ref={navbarRef}
          >
            <div className="px-4 py-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-3">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                />
                <button type="submit" className="px-3 py-2 bg-accent text-white rounded-md">Search</button>
              </form>

              <div className="flex flex-col gap-2">
                <button onClick={() => { navigate('/'); setIsNavOpen(false); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200">Home</button>
                <button onClick={() => { navigate('/add_product'); setIsNavOpen(false); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200">Add Product</button>
                <button onClick={() => { navigate('/orders'); setIsNavOpen(false); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200">Orders</button>
                <div className="pt-2 border-t dark:border-slate-700 mt-2">
                  <div className="text-sm font-medium mb-2 dark:text-slate-200">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button key={c} onClick={() => handleCategorySelect(c)} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 rounded-md text-sm">{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;