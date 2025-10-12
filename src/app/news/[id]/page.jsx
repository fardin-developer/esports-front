'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { newsService } from '../../services/newsService';
import NewsLoadingSkeleton from '../../components/NewsLoadingSkeleton';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const newsData = await newsService.getNewsById(params.id);
        setNews(newsData);
        
        // Fetch related news
        if (newsData.category) {
          try {
            const relatedResponse = await newsService.getNewsByCategory(newsData.category);
            // Handle response format: {success: true, data: {news: []}}
            let relatedNews = [];
            if (relatedResponse && relatedResponse.success && relatedResponse.data && relatedResponse.data.news) {
              relatedNews = relatedResponse.data.news
                .filter(item => item._id !== newsData._id)
                .slice(0, 3);
            }
            setRelatedNews(relatedNews);
          } catch (err) {
            console.error('Error fetching related news:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id]);



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
    // Convert markdown-like content to HTML
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-text mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-text mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-text mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 my-4">$1</ul>');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <NewsLoadingSkeleton count={1} />
        </div>
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="min-h-screen bg-bg py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold text-text mb-4">News Not Found</h1>
          <p className="text-text-muted mb-6">
            {error || 'The news article you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <button
            onClick={() => router.push('/feed')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Back to News
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg py-10 px-4 md:px-6 lg:px-8 bg-[#a6f2da]">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </button>

        {/* Article */}
        <article className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          {/* Header Image */}
          {news.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-text-muted border-b border-border pb-6">
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
                  {news.author.name || 'Admin'}
                </div>
              )}
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
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
              <div className="mb-8 p-4 bg-surface-light/50 rounded-xl border border-border">
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
            <div className="mt-12 pt-6 border-t border-border">
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
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedItem) => (
                <div
                  key={relatedItem._id}
                  className="bg-surface/60 backdrop-blur-xl border border-border rounded-xl p-4 hover:bg-surface/80 transition-colors duration-200 cursor-pointer"
                  onClick={() => router.push(`/news/${relatedItem._id}`)}
                >
                  <h3 className="font-semibold text-text mb-2 line-clamp-2">
                    {relatedItem.title}
                  </h3>
                  <p className="text-text-muted text-sm line-clamp-2 mb-3">
                    {relatedItem.summary || relatedItem.content.substring(0, 100)}
                  </p>
                  <div className="text-xs text-text-muted">
                    {formatDate(relatedItem.publishedAt || relatedItem.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
