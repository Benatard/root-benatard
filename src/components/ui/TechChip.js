import React from 'react';

export default function TechChip({ name, Icon, brand }) {
  return (
    <span className="inline-flex items-center gap-2.5 max-w-full border border-stroke/80 dark:border-[#2C303B] bg-gray2/70 dark:bg-[#232833] px-3.5 py-2 transition-all duration-300 hover:border-primary hover:bg-white hover:-translate-y-0.5 hover:shadow-card dark:hover:bg-[#2C303B]">
      <Icon className="w-4 h-4 flex-shrink-0 text-dark dark:text-body-dark" color={brand || undefined} />
      <span className="text-sm font-semibold text-dark dark:text-white truncate">{name}</span>
    </span>
  );
}
