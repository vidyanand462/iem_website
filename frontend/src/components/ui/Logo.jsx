import React from 'react';
import { Link } from 'react-router-dom';
import iemLogo from '../../assets/images/iem_logo.png';

/**
 * Institutional Logo Component
 * Displays the official emblem of Institute of Engineering & Management (IEM), Kolkata.
 */
export const Logo = ({ className = '', light = false, linkTo = '/' }) => {
  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`shrink-0 flex items-center justify-center rounded-lg transition-all ${
          light
            ? 'bg-white p-1 shadow-xs'
            : 'bg-transparent'
        }`}
      >
        <img
          src={iemLogo}
          alt="Institute of Engineering & Management (IEM) Official Logo"
          className="h-10 w-auto max-h-11 object-contain drop-shadow-xs"
        />
      </div>
      <div className="flex flex-col">
        <span className={`text-base font-extrabold tracking-tight leading-none ${light ? 'text-white' : 'text-iem-navy'}`}>
          IEM KOLKATA
        </span>
        <span className={`text-[10px] tracking-wide font-medium mt-0.5 ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          Inst. of Engineering & Management
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
