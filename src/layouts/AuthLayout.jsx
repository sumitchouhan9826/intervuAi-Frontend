import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Bot } from 'lucide-react';
import { fadeInLeft, fadeInRight } from '@/animations/variants';

function MiniChart() {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10">
      <polyline
        points="0,35 15,28 30,32 45,18 60,22 75,12 90,16 105,8 120,5"
        fill="none"
        stroke="#14B8A6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="0,35 15,28 30,32 45,18 60,22 75,12 90,16 105,8 120,5"
        fill="url(#chartGrad)"
        stroke="none"
      />
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT — Dark Hero Panel */}
      <motion.div
        {...fadeInLeft}
        className="hidden lg:flex w-1/2 bg-[#0A0A0B] flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            IntervuAI
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 -mt-8">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Master the
            <br />
            High-Stakes
            <br />
            Interview.
          </h2>
          <p className="text-white/50 mt-5 text-base leading-relaxed max-w-sm">
            Precision-engineered simulations. Pro-grade feedback.
            AI-driven growth for ambitious professionals.
          </p>
        </div>

        {/* Bottom Cards + Social Proof */}
        <div className="relative z-10 space-y-5">
          <div className="flex gap-4">
            {/* Session Analytics Card */}
            <div className="flex-1 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-white/80 text-xs font-medium">
                  Session Analytics
                </span>
              </div>
              <MiniChart />
              <div className="flex justify-between mt-2">
                <span className="text-white/40 text-[10px]">Mon</span>
                <span className="text-white/40 text-[10px]">Tue</span>
                <span className="text-white/40 text-[10px]">Wed</span>
                <span className="text-white/40 text-[10px]">Thu</span>
                <span className="text-white/40 text-[10px]">Fri</span>
              </div>
            </div>

            {/* AI Coach Card */}
            <div className="flex-1 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/80 text-xs font-medium">
                  AI Coach Active
                </span>
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">
                Real-time feedback on your responses, body language, and
                technical accuracy.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400/70 text-[10px] font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#6366f1', '#f97316', '#14b8a6', '#e11d48'].map(
                (color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#0A0A0B] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {['A', 'B', 'K', 'S'][i]}
                  </div>
                )
              )}
            </div>
            <span className="text-white/50 text-xs">
              Joined by <span className="text-white/70 font-medium">10k+</span>{' '}
              Tech Leaders
            </span>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Auth Form Panel */}
      <motion.div
        {...fadeInRight}
        className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
