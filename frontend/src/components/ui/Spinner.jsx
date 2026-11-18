import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '', label }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-iem-blue`} />
      {label && <p className="text-xs text-slate-500 font-medium animate-pulse">{label}</p>}
    </div>
  );
};

export default Spinner;
