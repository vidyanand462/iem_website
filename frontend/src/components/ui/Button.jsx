import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.98]';

  const variants = {
    primary: 'bg-iem-blue hover:bg-iem-blue-dark text-white shadow-sm hover:shadow focus-visible:ring-iem-blue',
    secondary: 'bg-iem-navy hover:bg-iem-navy-light text-white shadow-sm focus-visible:ring-iem-navy',
    outline: 'border border-slate-300 hover:border-iem-blue hover:bg-iem-blue/5 text-slate-700 hover:text-iem-blue focus-visible:ring-iem-blue',
    ghost: 'text-slate-600 hover:text-iem-blue hover:bg-slate-100 focus-visible:ring-iem-blue',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus-visible:ring-emerald-600',
    white: 'bg-white hover:bg-slate-50 text-iem-navy shadow-sm focus-visible:ring-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
    xl: 'px-7 py-3.5 text-base font-semibold gap-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
