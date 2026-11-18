import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-iem-blue border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    // Status mappings
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    FLAGGED: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FILLING_FAST: 'bg-amber-50 text-amber-700 border-amber-200',
    FULL: 'bg-rose-50 text-rose-700 border-rose-200',
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
