import React, { useState } from 'react';
import { LegalEaseLogo } from './LegalEaseLogo';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView?: string;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isLoggedIn = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="cursor-pointer" onClick={() => handleNav(isLoggedIn ? 'dashboard' : 'landing')}>
          <LegalEaseLogo size="md" />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('templates')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Templates
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Security
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => handleNav('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNav('login')}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('create')}
                className="inline-flex items-center gap-2 px-4.5 py-2.2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <button
            onClick={() => scrollToSection('templates')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Templates
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Pricing
          </button>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {isLoggedIn ? (
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full py-2.5 text-center font-semibold text-white bg-blue-600 rounded-xl"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('create')}
                  className="w-full py-2.5 text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
