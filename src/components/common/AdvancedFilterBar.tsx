import React from 'react';
import { Search, Filter, RotateCcw, Download, Calendar, MapPin, Grid, List } from 'lucide-react';

export interface FilterValues {
  search: string;
  status: string;
  secondaryFilter?: string; // e.g. driverId, vehicleType, licenseType
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface AdvancedFilterBarProps {
  filters: FilterValues;
  onFilterChange: (newFilters: FilterValues) => void;
  statusOptions: { label: string; value: string }[];
  secondaryOptions?: { label: string; value: string; placeholder?: string };
  secondaryPlaceholder?: string;
  secondaryLabel?: string;
  secondaryItems?: { label: string; value: string }[];
  showDateFilter?: boolean;
  showLocationFilter?: boolean;
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  onExportCsv?: () => void;
  searchPlaceholder?: string;
  totalResultsCount?: number;
}

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  filters,
  onFilterChange,
  statusOptions,
  secondaryLabel,
  secondaryPlaceholder = 'All options',
  secondaryItems,
  showDateFilter = true,
  showLocationFilter = true,
  viewMode,
  onViewModeChange,
  onExportCsv,
  searchPlaceholder = 'Search records...',
  totalResultsCount,
}) => {
  const handleTextChange = (field: keyof FilterValues, val: string) => {
    onFilterChange({
      ...filters,
      [field]: val,
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      status: 'ALL',
      secondaryFilter: 'ALL',
      location: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.secondaryFilter && filters.secondaryFilter !== 'ALL') ||
    Boolean(filters.location) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-4 space-y-3.5 mb-6 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
      {/* Primary search and quick status row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleTextChange('search', e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={filters.status || 'ALL'}
              onChange={(e) => handleTextChange('status', e.target.value)}
              className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-2 px-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Secondary dropdown if provided */}
        {secondaryItems && (
          <div className="md:col-span-4">
            <select
              value={filters.secondaryFilter || 'ALL'}
              onChange={(e) => handleTextChange('secondaryFilter', e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-2 px-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">{secondaryPlaceholder || secondaryLabel || 'All'}</option>
              {secondaryItems.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Secondary filter parameters: Location, Date Range, View Switcher & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/90 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Location Search */}
          {showLocationFilter && (
            <div className="relative min-w-[170px]">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="City or state..."
                value={filters.location || ''}
                onChange={(e) => handleTextChange('location', e.target.value)}
                className="w-full rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          {/* Date Range */}
          {showDateFilter && (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">From:</span>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleTextChange('startDate', e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>
          )}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}

          {totalResultsCount !== undefined && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Showing <span className="text-slate-900 dark:text-white font-semibold">{totalResultsCount}</span> results
            </span>
          )}
        </div>

        {/* Right side: View Mode & CSV Export */}
        <div className="flex items-center gap-2">
          {viewMode && onViewModeChange && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-950/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-all font-medium cursor-pointer active:scale-95"
              title="Export filtered records to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
