import React from 'react';
import { newsCategories, priorityConfig } from '../services/newsService';

const NewsFilterBar = ({ 
  activeCategory, 
  activePriority, 
  showPinnedOnly, 
  onCategoryChange, 
  onPriorityChange, 
  onPinnedToggle,
  onClearFilters 
}) => {
  return (
    <div className="bg-surface/60 backdrop-blur-xl border border-border rounded-2xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Title and clear filters */}
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-text">Filters</h3>
          {(activeCategory || activePriority || showPinnedOnly) && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1 text-xs bg-surface-light text-text-muted rounded-lg hover:text-primary hover:bg-surface-light/80 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-muted self-center">Category:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange(null)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  !activeCategory
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-light text-text-muted border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                All
              </button>
              {Object.entries(newsCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => onCategoryChange(key)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 flex items-center gap-1 ${
                    activeCategory === key
                      ? `${category.bgColor} ${category.borderColor} border text-text`
                      : 'bg-surface-light text-text-muted border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-muted self-center">Priority:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onPriorityChange(null)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  !activePriority
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-light text-text-muted border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                All
              </button>
              {Object.entries(priorityConfig).map(([key, priority]) => (
                <button
                  key={key}
                  onClick={() => onPriorityChange(key)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                    activePriority === key
                      ? `${priority.bgColor} ${priority.borderColor} border ${priority.color}`
                      : 'bg-surface-light text-text-muted border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPinnedOnly}
                onChange={onPinnedToggle}
                className="w-4 h-4 text-primary bg-surface-light border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-text-muted">Pinned Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(activeCategory || activePriority || showPinnedOnly) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-muted">Active filters:</span>
            {activeCategory && (
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30">
                {newsCategories[activeCategory]?.label}
              </span>
            )}
            {activePriority && (
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30">
                {priorityConfig[activePriority]?.label} Priority
              </span>
            )}
            {showPinnedOnly && (
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30">
                Pinned Only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFilterBar;
