import React, { useEffect, useRef, useState } from 'react';

export default function SkillBar({ name, level, color }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span className="text-dark dark:text-white truncate">{name}</span>
        <span className="text-body dark:text-body-dark flex-shrink-0">{level}%</span>
      </div>
      <div className="mt-2 h-2 bg-gray2 dark:bg-[#2C303B] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-[width] duration-700 ease-out`}
          style={{ width: visible ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  );
}