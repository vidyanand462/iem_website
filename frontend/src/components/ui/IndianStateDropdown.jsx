import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, MapPin, X } from 'lucide-react';
import {
  ALL_28_INDIAN_STATES,
  UNION_TERRITORIES,
  ALL_INDIAN_STATES_AND_UTS,
} from '../../constants/indiaGeoData';

export const IndianStateDropdown = ({
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'STATES' | 'UTS'
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filtered states based on active tab and search query
  const filteredStates = useMemo(() => {
    let sourceList;
    if (activeTab === 'STATES') {
      sourceList = ALL_28_INDIAN_STATES;
    } else if (activeTab === 'UTS') {
      sourceList = UNION_TERRITORIES;
    } else {
      sourceList = ALL_INDIAN_STATES_AND_UTS;
    }

    if (!searchTerm.trim()) {
      return sourceList;
    }

    const query = searchTerm.trim().toLowerCase();
    return sourceList.filter((s) => s.toLowerCase().includes(query));
  }, [activeTab, searchTerm]);

  const handleSelect = (stateName) => {
    onChange(stateName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          State (India) {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] font-bold text-iem-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          28 States of India
        </span>
      </div>

      {/* Dropdown Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm bg-white border rounded-lg transition-all text-left focus:outline-none focus:ring-2 focus:ring-iem-blue/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-300 text-rose-900 focus:border-rose-500'
            : isOpen
            ? 'border-iem-blue ring-2 ring-iem-blue/20'
            : 'border-slate-300 text-slate-900 hover:border-slate-400'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-iem-blue shrink-0" />
          <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
            {value || 'Select from 28 Indian States...'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded hidden sm:inline-block">
            IN
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-iem-blue' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Box Header */}
          <div className="p-2.5 bg-slate-50/90 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across all 28 Indian States (e.g. West Bengal, Bihar)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iem-blue/30 focus:border-iem-blue"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'ALL'
                    ? 'bg-iem-blue text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({ALL_INDIAN_STATES_AND_UTS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('STATES')}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'STATES'
                    ? 'bg-iem-blue text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                28 States ({ALL_28_INDIAN_STATES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('UTS')}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'UTS'
                    ? 'bg-iem-blue text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Union Territories ({UNION_TERRITORIES.length})
              </button>
            </div>
          </div>

          {/* List of States */}
          <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-slate-50">
            {filteredStates.length > 0 ? (
              filteredStates.map((stateName) => {
                const isSelected = value?.toLowerCase() === stateName.toLowerCase();
                const isState = ALL_28_INDIAN_STATES.includes(stateName);

                return (
                  <button
                    key={stateName}
                    type="button"
                    onClick={() => handleSelect(stateName)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-iem-blue text-white font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate">{stateName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isState
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isState ? 'State' : 'UT'}
                      </span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching Indian states or UTs found for "{searchTerm}"
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Official India Administrative Directory</span>
            <span className="font-semibold text-iem-blue">28 States of India</span>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export default IndianStateDropdown;
