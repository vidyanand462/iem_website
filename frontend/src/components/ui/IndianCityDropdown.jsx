import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Building2, X, AlertCircle } from 'lucide-react';
import {
  getCitiesForState,
  validateIndianCity,
  CITIES_BY_STATE,
} from '../../constants/indiaGeoData';

export const IndianCityDropdown = ({
  value,
  state,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Available cities for the selected state
  const availableCities = useMemo(() => {
    if (state) {
      const stateCities = getCitiesForState(state);
      if (stateCities.length > 0) return stateCities;
    }
    // If no state selected, aggregate major cities across all states
    const majors = [];
    Object.values(CITIES_BY_STATE).forEach((cities) => {
      majors.push(...cities.slice(0, 3));
    });
    return majors;
  }, [state]);

  // Filtered cities based on search
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableCities;
    }
    const query = searchTerm.trim().toLowerCase();
    // First search in selected state's cities
    const inState = availableCities.filter((c) => c.toLowerCase().includes(query));
    if (inState.length > 0) {
      return inState;
    }
    // Fallback: search across all cities in India
    const allMatches = [];
    Object.entries(CITIES_BY_STATE).forEach(([sName, cities]) => {
      cities.forEach((c) => {
        if (c.toLowerCase().includes(query)) {
          allMatches.push(`${c} (${sName})`);
        }
      });
    });
    return allMatches;
  }, [availableCities, searchTerm]);

  // Live validation of current value
  const validationStatus = useMemo(() => {
    if (!value) return null;
    return validateIndianCity(value, state);
  }, [value, state]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (cityName) => {
    // Strip trailing "(State)" if present
    const cleanCity = cityName.replace(/\s*\(.*?\)$/, '').trim();
    onChange(cleanCity);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleDirectInputChange = (e) => {
    // Strip negative numbers or numbers
    const clean = e.target.value.replace(/[0-9\-]/g, '');
    onChange(clean);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          City / District {required && <span className="text-rose-500">*</span>}
        </label>
        {validationStatus?.valid ? (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Recognized Indian City
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Indian Cities Only
          </span>
        )}
      </div>

      {/* Input / Dropdown Trigger Box */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Building2 className="w-4 h-4 text-slate-400" />
        </div>

        <input
          type="text"
          disabled={disabled}
          value={value}
          placeholder={state ? `Select/type city in ${state}...` : 'Select/type recognized Indian city...'}
          onChange={handleDirectInputChange}
          onClick={() => !disabled && setIsOpen(true)}
          className={`w-full pl-9 pr-16 py-2 text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-iem-blue/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 text-rose-900 focus:border-rose-500'
              : validationStatus?.valid
              ? 'border-emerald-300 text-slate-900 focus:border-emerald-500'
              : 'border-slate-300 text-slate-900 focus:border-iem-blue'
          }`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            title="Browse Indian cities"
          >
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isOpen ? 'rotate-180 text-iem-blue' : ''
              }`}
            />
          </button>
        </div>
      </div>

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
                onChange={(e) => setSearchTerm(e.target.value.replace(/[0-9\-]/g, ''))}
                placeholder={
                  state
                    ? `Search recognized cities in ${state}...`
                    : 'Search recognized cities across India...'
                }
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

            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600">
              <span>{state ? `Cities in ${state}` : 'Select a State for localized cities'}</span>
              <span className="font-semibold text-iem-blue">{filteredCities.length} cities available</span>
            </div>
          </div>

          {/* List of Cities */}
          <div className="max-h-56 overflow-y-auto p-1.5 divide-y divide-slate-50">
            {filteredCities.length > 0 ? (
              filteredCities.map((cName) => {
                const baseName = cName.replace(/\s*\(.*?\)$/, '').trim();
                const isSelected = value?.toLowerCase() === baseName.toLowerCase();

                return (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => handleSelect(cName)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-iem-blue text-white font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cName}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                <AlertCircle className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                No recognized Indian cities found matching "{searchTerm}".
                <div className="mt-1 text-[11px] text-slate-400">
                  Only official Indian municipal corporations and district headquarters are accepted.
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500">
            * Valid recognized Indian cities & districts only. Numbers and negative values not allowed.
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {!error && value && !validationStatus?.valid && (
        <p className="mt-1 text-xs text-amber-700 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>"{value}" is not a recognized Indian city. Please select a valid city from the list.</span>
        </p>
      )}
      {!error && !value && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export default IndianCityDropdown;
