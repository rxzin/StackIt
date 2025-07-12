// Utility functions for question similarity and search

/**
 * Calculate similarity between two strings using Jaccard similarity
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateJaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Calculate cosine similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateCosineSimilarity = (str1, str2) => {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  // Create word frequency vectors
  const allWords = [...new Set([...words1, ...words2])];
  const vector1 = allWords.map(word => words1.filter(w => w === word).length);
  const vector2 = allWords.map(word => words2.filter(w => w === word).length);
  
  // Calculate dot product
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Extract keywords from text using simple frequency analysis
 * @param {string} text - Input text
 * @param {number} maxKeywords - Maximum number of keywords to return
 * @returns {Array<string>} - Array of keywords
 */
export const extractKeywords = (text, maxKeywords = 10) => {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Calculate tag similarity between two questions
 * @param {Array<string>} tags1 - Tags from first question
 * @param {Array<string>} tags2 - Tags from second question
 * @returns {number} - Tag similarity score between 0 and 1
 */
export const calculateTagSimilarity = (tags1, tags2) => {
  if (tags1.length === 0 && tags2.length === 0) return 1;
  if (tags1.length === 0 || tags2.length === 0) return 0;
  
  const set1 = new Set(tags1.map(tag => tag.toLowerCase()));
  const set2 = new Set(tags2.map(tag => tag.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Find similar questions based on title, description, and tags
 * @param {Object} targetQuestion - The question to find similarities for
 * @param {Array<Object>} allQuestions - Array of all questions to search through
 * @param {number} threshold - Minimum similarity threshold (0-1)
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array<Object>} - Array of similar questions with similarity scores
 */
export const findSimilarQuestions = (targetQuestion, allQuestions, threshold = 0.3, maxResults = 5) => {
  const similarities = allQuestions
    .filter(q => q.id !== targetQuestion.id)
    .map(question => {
      // Calculate title similarity (weighted more heavily)
      const titleSimilarity = calculateCosineSimilarity(
        targetQuestion.title,
        question.title
      );
      
      // Calculate description similarity
      const descSimilarity = calculateCosineSimilarity(
        targetQuestion.description || '',
        question.description || ''
      );
      
      // Calculate tag similarity
      const tagSimilarity = calculateTagSimilarity(
        targetQuestion.tags || [],
        question.tags || []
      );
      
      // Weighted average (title: 50%, description: 30%, tags: 20%)
      const overallSimilarity = (
        titleSimilarity * 0.5 +
        descSimilarity * 0.3 +
        tagSimilarity * 0.2
      );
      
      return {
        ...question,
        similarity: overallSimilarity,
        titleSimilarity,
        descSimilarity,
        tagSimilarity
      };
    })
    .filter(q => q.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);
  
  return similarities;
};

/**
 * Search questions with fuzzy matching and ranking
 * @param {string} query - Search query
 * @param {Array<Object>} questions - Array of questions to search
 * @param {Object} options - Search options
 * @returns {Array<Object>} - Ranked search results
 */
export const searchQuestions = (query, questions, options = {}) => {
  const {
    includeAnswered = true,
    includeTags = true,
    minScore = 0.1,
    maxResults = 20
  } = options;
  
  if (!query.trim()) return questions.slice(0, maxResults);
  
  const queryKeywords = extractKeywords(query, 5);
  
  const results = questions
    .filter(question => {
      if (!includeAnswered && question.answers > 0) return false;
      return true;
    })
    .map(question => {
      let score = 0;
      
      // Title matching (highest weight)
      const titleScore = calculateCosineSimilarity(query, question.title);
      score += titleScore * 0.4;
      
      // Description matching
      const descScore = calculateCosineSimilarity(query, question.description || '');
      score += descScore * 0.3;
      
      // Tag matching
      if (includeTags && question.tags) {
        const tagText = question.tags.join(' ');
        const tagScore = calculateCosineSimilarity(query, tagText);
        score += tagScore * 0.2;
      }
      
      // Keyword matching bonus
      const questionKeywords = extractKeywords(
        `${question.title} ${question.description || ''}`,
        10
      );
      const keywordMatches = queryKeywords.filter(kw => 
        questionKeywords.some(qkw => qkw.includes(kw) || kw.includes(qkw))
      ).length;
      score += (keywordMatches / Math.max(queryKeywords.length, 1)) * 0.1;
      
      return {
        ...question,
        searchScore: score,
        titleScore,
        descScore,
        keywordMatches
      };
    })
    .filter(q => q.searchScore >= minScore)
    .sort((a, b) => {
      // Primary sort by search score
      if (b.searchScore !== a.searchScore) {
        return b.searchScore - a.searchScore;
      }
      // Secondary sort by votes
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // Tertiary sort by recency
      return new Date(b.timeAgo) - new Date(a.timeAgo);
    })
    .slice(0, maxResults);
  
  return results;
};

/**
 * Get search suggestions based on partial query
 * @param {string} partialQuery - Partial search query
 * @param {Array<Object>} questions - Array of questions
 * @param {number} maxSuggestions - Maximum number of suggestions
 * @returns {Array<string>} - Array of search suggestions
 */
export const getSearchSuggestions = (partialQuery, questions, maxSuggestions = 5) => {
  if (partialQuery.length < 2) return [];
  
  const query = partialQuery.toLowerCase();
  const suggestions = new Set();
  
  questions.forEach(question => {
    // Extract phrases from title
    const titleWords = question.title.toLowerCase().split(/\s+/);
    for (let i = 0; i < titleWords.length; i++) {
      for (let j = i + 1; j <= Math.min(i + 4, titleWords.length); j++) {
        const phrase = titleWords.slice(i, j).join(' ');
        if (phrase.includes(query) && phrase.length > query.length) {
          suggestions.add(phrase);
        }
      }
    }
    
    // Add matching tags
    if (question.tags) {
      question.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    }
  });
  
  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length)
    .slice(0, maxSuggestions);
};