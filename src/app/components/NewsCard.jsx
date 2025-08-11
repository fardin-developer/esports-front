import React from 'react';
import { useRouter } from 'next/navigation';
import { newsCategories, priorityConfig } from '../services/newsService';

const NewsCard = ({ news, isPinned = false }) => {
  const router = useRouter();
  const category = newsCategories[news.category] || newsCategories.general;
  const priority = priorityConfig[news.priority] || priorityConfig.medium;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    router.push(`/news/${news._id}`);
  };

  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        rounded-2xl border border-border bg-surface/80 backdrop-blur-xl overflow-hidden
        ${isPinned ? 'ring-2 ring-primary/50 shadow-primary/20' : 'hover:shadow-primary/20'}
      `}
      onClick={handleClick}
    >
      {/* Pinned indicator */}
      {isPinned && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            📌 Pinned
          </div>
        </div>
      )}

      {/* Priority indicator */}
      <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-xs font-semibold ${priority.color} ${priority.bgColor} ${priority.borderColor} border`}>
        {priority.label}
      </div>

      {/* Image */}
      {news.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category and date */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${category.bgColor} ${category.borderColor} border`}>
            <span className="text-lg">{category.icon}</span>
            <span className="text-text">{category.label}</span>
          </div>
          <span className="text-xs text-text-muted">
            {formatDate(news.publishedAt || news.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {news.title}
        </h3>

        {/* Summary or Content preview */}
        {news.summary ? (
          <p className="text-text-muted text-sm mb-4 line-clamp-3">
            {truncateText(news.summary, 150)}
          </p>
        ) : news.content ? (
          <p className="text-text-muted text-sm mb-4 line-clamp-3">
            {truncateText(news.content.replace(/<[^>]*>/g, ''), 150)}
          </p>
        ) : (
          <p className="text-text-muted text-sm mb-4 italic">
            No preview available
          </p>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-surface-light text-text-muted text-xs rounded-full border border-border"
              >
                #{tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="px-2 py-1 bg-surface-light text-text-muted text-xs rounded-full border border-border">
                +{news.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              👁️ {news.viewCount || 0} views
            </span>
            {news.author && (
              <span className="flex items-center gap-1">
                👤 {news.author.name || 'Admin'}
              </span>
            )}
          </div>
          
          {/* Read more indicator */}
          <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all duration-200">
            Read More
            <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Gradient border effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
};

export default NewsCard;
