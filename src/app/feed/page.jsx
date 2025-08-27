'use client';

import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import NewsCard from '../components/NewsCard';
// import NewsFilterBar from '../components/NewsFilterBar';
import NewsLoadingSkeleton from '../components/NewsLoadingSkeleton';

export default function FeedPage() {
  const [news, setNews] = useState([]);
  const [pinnedNews, setPinnedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  // const [activeCategory, setActiveCategory] = useState(null);
  // const [activePriority, setActivePriority] = useState(null);
  // const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Fetch news data
  const fetchNews = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToApply = {
        status: 'published',
        ...filters
      };
      
      const response = await newsService.getNewsList(filtersToApply);

      console.log(response);
      
      // Handle the actual API response format: {success: true, data: {news: [], pagination: {}, stats: {}}}
      let newsData = [];
      if (response && response.success && response.data && response.data.news) {
        newsData = response.data.news;
      }
      
      setNews(newsData);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
      setNews([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  // Fetch pinned news
  const fetchPinnedNews = async () => {
    try {
      const response = await newsService.getPinnedNews();
      
      // Handle the actual API response format for pinned news
      let pinnedData = [];
      if (response && response.success && response.data && response.data.news) {
        pinnedData = response.data.news.filter(news => news.isPinned);
      }
      
      setPinnedNews(pinnedData);
    } catch (err) {
      console.error('Error fetching pinned news:', err);
      setPinnedNews([]); // Ensure it's always an array
    }
  };

  // Handle filter changes
  // const handleCategoryChange = (category) => {
  //   setActiveCategory(category);
  //   const filters = {};
  //   if (category) filters.category = category;
  //   if (activePriority) filters.priority = activePriority;
  //   if (showPinnedOnly) filters.isPinned = true;
  //   fetchNews(filters);
  // };

  const handlePriorityChange = (priority) => {
    setActivePriority(priority);
    const filters = {};
    if (activeCategory) filters.category = activeCategory;
    if (priority) filters.priority = priority;
    if (showPinnedOnly) filters.isPinned = true;
    fetchNews(filters);
  };

  const handlePinnedToggle = (checked) => {
    setShowPinnedOnly(checked);
    const filters = {};
    if (activeCategory) filters.category = activeCategory;
    if (activePriority) filters.priority = activePriority;
    if (checked) filters.isPinned = true;
    fetchNews(filters);
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setActivePriority(null);
    setShowPinnedOnly(false);
    fetchNews({ status: 'published' });
  };

  // Initial data fetch
  useEffect(() => {
    fetchNews({ status: 'published' });
    fetchPinnedNews();
  }, []);



  return (
    <main className="min-h-screen bg-bg py-10 px-4 md:px-6 lg:px-8 bg-yellow-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black shimmer mb-4">
            News & Updates
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Stay informed with the latest gaming news, updates, and announcements from your favorite games
          </p>
        </div>

        {/* Pinned News Section */}
        {pinnedNews.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              📌 Pinned News
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pinnedNews.map((newsItem) => (
                <NewsCard
                  key={newsItem._id}
                  news={newsItem}
                  isPinned={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        {/* <NewsFilterBar
          activeCategory={activeCategory}
          activePriority={activePriority}
          showPinnedOnly={showPinnedOnly}
          onCategoryChange={handleCategoryChange}
          onPriorityChange={handlePriorityChange}
          onPinnedToggle={handlePinnedToggle}
          onClearFilters={handleClearFilters}
        /> */}

        {/* News Grid */}
        <div className="mb-8">
          {loading ? (
            <NewsLoadingSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-error text-lg mb-4">{error}</div>
              <button
                onClick={() => fetchNews({ status: 'published' })}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-text mb-2">No News Found</h3>
              <p className="text-text-muted mb-6">
                No news articles match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((newsItem) => (
                <NewsCard
                  key={newsItem._id}
                  news={newsItem}
                  isPinned={newsItem.isPinned}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && !error && news.length > 0 && (
          <div className="text-center">
            <button className="px-8 py-3 bg-surface-light text-text rounded-lg hover:bg-surface-light/80 transition-colors duration-200 border border-border">
              Load More News
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
