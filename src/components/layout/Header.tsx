"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { homeContent } from "@/content/home";

const navLinks = [
  { name: "Why Aashray", href: "/#about" },
  { name: "About Us", href: "/about" },
  { name: "Learning", href: "/learning" },
  { name: "Products", href: "/#products", hasDropdown: true },
  { name: "Contact", href: "/book-a-demo" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle transparent to solid background transition
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm h-24 md:h-36 flex items-center border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 flex justify-between items-center relative">
        
        {/* Mobile Header Layout */}
        <div className="flex 2xl:hidden w-full justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Aashray Infotech Logo"
              width={60}
              height={60}
              className="w-[60px] h-[60px] object-contain rounded-md"
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              className="p-2 text-neutral-text dark:text-white flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-3 lg:mr-4 shadow-sm"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
              <span className="text-sm font-semibold pr-1">Menu</span>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Exact Center Logo & Equidistant */}
        <div className="hidden 2xl:flex w-full items-center relative">
          
          {/* Left Nav */}
          <div className="flex-1 flex justify-end items-center gap-8 xl:gap-12 pr-12 xl:pr-24">
            {navLinks.slice(0, 3).map((link) => (
              <div key={link.name} className="relative group">
                <Link href={link.href} className="text-base xl:text-lg font-semibold text-neutral-text dark:text-white hover:text-primary transition-colors py-1 whitespace-nowrap">
                  {link.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 z-10">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="Aashray Infotech Logo"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain rounded-md"
              />
            </Link>
          </div>

          {/* Right Nav */}
          <div className="flex-1 flex justify-start items-center gap-8 xl:gap-12 pl-12 xl:pl-24">
            {navLinks.slice(3).map((link) => (
              <div key={link.name} className="relative group" onMouseEnter={() => link.hasDropdown && setProductsOpen(true)} onMouseLeave={() => link.hasDropdown && setProductsOpen(false)}>
                <Link href={link.href} className="flex items-center gap-1 text-base xl:text-lg font-semibold text-neutral-text dark:text-white hover:text-primary transition-colors py-1 whitespace-nowrap">
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-5 h-5" />}
                </Link>
                {link.hasDropdown && (
                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-4 w-64"
                      >
                        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col gap-1">
                          {homeContent.ourPlatforms.items.map((item: any) => (
                            <Link 
                              key={item.slug} 
                              href={`/${item.category}/${item.slug}`}
                              className="px-4 py-3 rounded-lg hover:bg-neutral-bg dark:hover:bg-gray-900 text-neutral-text dark:text-white transition-colors"
                              onClick={() => setProductsOpen(false)}
                            >
                              <div className="font-semibold">{item.name}</div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            <div className="flex items-center border-l border-gray-200 dark:border-gray-800 pl-8 h-8 gap-4">
              <ThemeToggle />
              <button
                className="p-2 text-neutral-text dark:text-white flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
                <span className="text-sm font-semibold pr-1">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 2xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-950 z-50 shadow-xl flex flex-col 2xl:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                <Image
                  src="/logo.jpg"
                  alt="Aashray Infotech Logo"
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] object-contain rounded-md"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-text dark:text-white rounded-md hover:bg-neutral-bg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col py-4 px-6 gap-2 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <div>
                        <button 
                          onClick={() => setProductsOpen(!productsOpen)}
                          className="flex items-center justify-between w-full py-3 text-base font-medium text-neutral-text dark:text-white"
                        >
                          {link.name}
                          <ChevronDown className={`w-5 h-5 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {productsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col pl-4 gap-2 border-l-2 border-gray-100 dark:border-gray-800 ml-2 mb-2"
                            >
                              {homeContent.ourPlatforms.items.map((item: any) => (
                                <Link 
                                  key={item.slug} 
                                  href={`/${item.category}/${item.slug}`}
                                  className="py-2 text-sm text-gray-600 dark:text-gray-300"
                                  onClick={() => { setMobileMenuOpen(false); setProductsOpen(false); }}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 text-base font-medium text-neutral-text dark:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
