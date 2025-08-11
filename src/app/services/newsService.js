import { apiClient } from '../apiClient';

export const newsService = {
  // Get all news with optional filters
  async getNewsList(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.isPinned) queryParams.append('isPinned', filters.isPinned);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);
      
      const queryString = queryParams.toString();
      const url = `/news/list`;
      
      return await apiClient.get(url);
    } catch (error) {
      console.error('Error fetching news list:', error);
      throw error;
    }
  },

  // Get single news article by ID
  async getNewsById(id) {
    try {
      const response = await apiClient.get(`/news/${id}`);
      // Handle response format: {success: true, data: newsObject}
      if (response && response.success && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      throw error;
    }
  },

  // Get pinned news
  async getPinnedNews() {
    try {
      return await apiClient.get('/news/list?isPinned=true&limit=5');
    } catch (error) {
      console.error('Error fetching pinned news:', error);
      throw error;
    }
  },

  // Get news by category
  async getNewsByCategory(category) {
    try {
      return await apiClient.get(`/news/list?category=${category}`);
    } catch (error) {
      console.error('Error fetching news by category:', error);
      throw error;
    }
  }
};

// News category configuration
export const newsCategories = {
  announcement: {
    label: 'Announcements',
    icon: '📢',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  update: {
    label: 'Updates',
    icon: '🔄',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  maintenance: {
    label: 'Maintenance',
    icon: '🔧',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  promotion: {
    label: 'Promotions',
    icon: '🎉',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  general: {
    label: 'General',
    icon: '📰',
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20'
  }
};

// Priority configuration
export const priorityConfig = {
  low: {
    label: 'Low',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20'
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  }
};
