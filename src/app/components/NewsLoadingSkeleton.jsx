import React from 'react';

const NewsLoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative rounded-2xl border border-border bg-surface/80 backdrop-blur-xl overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-surface-light/50" />
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Category and date skeleton */}
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-24 bg-surface-light/50 rounded-full" />
              <div className="h-4 w-16 bg-surface-light/50 rounded" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-6 bg-surface-light/50 rounded w-3/4" />
              <div className="h-6 bg-surface-light/50 rounded w-1/2" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-surface-light/50 rounded w-full" />
              <div className="h-4 bg-surface-light/50 rounded w-5/6" />
              <div className="h-4 bg-surface-light/50 rounded w-4/6" />
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-surface-light/50 rounded-full" />
              <div className="h-6 w-20 bg-surface-light/50 rounded-full" />
              <div className="h-6 w-14 bg-surface-light/50 rounded-full" />
            </div>

            {/* Stats skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-surface-light/50 rounded" />
                <div className="h-4 w-12 bg-surface-light/50 rounded" />
              </div>
              <div className="h-4 w-20 bg-surface-light/50 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsLoadingSkeleton;
