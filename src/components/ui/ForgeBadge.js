import React from 'react';

export const FORGE_URL = 'https://forgestartup.com';

const FORGE_DOTS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

export default function ForgeBadge({ text, className = '', dots = false }) {
  return (
    <a
      href={FORGE_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 transition-colors ${className}`}
    >
      {dots && (
        <span className="flex items-center gap-1.5 mr-0.5">
          {FORGE_DOTS.map((c) => (
            <span key={c} className={`w-2 h-2 rounded-full ${c}`} />
          ))}
        </span>
      )}
      <span className="w-6 h-6 flex-shrink-0 rounded-md bg-white ring-1 ring-black/5 dark:ring-white/10 p-0.5 flex items-center justify-center">
        <img src="/images/forge-mark.png" alt="Forge" className="w-full h-full object-contain" />
      </span>
      <span>{text}</span>
    </a>
  );
}