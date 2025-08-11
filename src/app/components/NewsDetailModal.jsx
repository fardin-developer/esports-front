import React, { useEffect } from 'react';
import { newsCategories, priorityConfig } from '../services/newsService';

const NewsDetailModal = ({ news, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !news) return null;

  const category = newsCategories[news.category] || newsCategories.general;
  const priority = priorityConfig[news.priority] || priorityConfig.medium;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    // Simple HTML content formatting
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-surface-light/80 backdrop-blur-sm border border-border text-text hover:text-primary hover:bg-surface-light transition-all duration-200 flex items-center justify-center group"
        >
          <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header Image */}
          {news.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Category and priority badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${category.bgColor} ${category.borderColor} border backdrop-blur-sm`}>
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-text">{category.label}</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${priority.bgColor} ${priority.borderColor} border backdrop-blur-sm ${priority.color}`}>
                  {priority.label} Priority
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-4 leading-tight">
              {news.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(news.publishedAt || news.createdAt)}
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {news.viewCount || 0} views
              </div>

              {news.author && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Admin
                </div>
              )}
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {news.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-surface-light text-text-muted text-sm rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {news.summary && (
              <div className="mb-6 p-4 bg-surface-light/50 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-text mb-2">Summary</h3>
                <p className="text-text-muted leading-relaxed">
                  {news.summary}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-text leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: formatContent(news.content) }}
              />
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm text-text-muted">
                <div className="flex items-center gap-4">
                  <span>Last updated: {formatDate(news.updatedAt)}</span>
                  {news.expiresAt && (
                    <span>Expires: {formatDate(news.expiresAt)}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
