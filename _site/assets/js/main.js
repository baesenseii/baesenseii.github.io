// Terminal Blog - Main JavaScript
// Handles post navigation and dynamic content loading

(function() {
  'use strict';
  
  // Cache DOM elements
  const postIndex = document.getElementById('post-index');
  const postViewer = document.getElementById('post-viewer');
  const centerPath = document.getElementById('center-path');
  
  // Get all clickable post elements
  const postLinksTable = document.querySelectorAll('.post-link');
  const postLinksLs = document.querySelectorAll('.post-item');
  
  // Post data cache
  const postCache = new Map();
  
  /**
   * Fetch and cache post content
   */
  async function fetchPost(url) {
    if (postCache.has(url)) {
      return postCache.get(url);
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch post');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract post content
      const postContent = doc.querySelector('.post-content');
      if (postContent) {
        postCache.set(url, postContent.innerHTML);
        return postContent.innerHTML;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return `<div class="error">Error loading post. <a href="${url}">Click here to view directly.</a></div>`;
    }
  }
  
  /**
   * Display post content
   */
  async function showPost(url, title) {
    // Update UI state
    postIndex.classList.remove('active');
    postViewer.classList.add('active');
    
    // Update path
    const slug = url.split('/').filter(s => s).pop() || title;
    centerPath.textContent = `posts/${slug}`;
    
    // Show loading state
    postViewer.innerHTML = '<div class="loading">Loading post...</div>';
    
    // Fetch and display content
    const content = await fetchPost(url);
    if (content) {
      postViewer.innerHTML = content;
      
      // Update active states in left pane
      updateActivePost(url);
      
      // Scroll to top
      const centerPane = document.querySelector('.pane-center .pane-content');
      if (centerPane) centerPane.scrollTop = 0;
      
      // Add back to index functionality
      addBackButtonHandler();
    }
  }
  
  /**
   * Show post index
   */
  function showIndex() {
    postViewer.classList.remove('active');
    postIndex.classList.add('active');
    centerPath.textContent = 'index';
    
    // Clear active states
    document.querySelectorAll('.post-item').forEach(item => {
      item.classList.remove('active');
    });
  }
  
  /**
   * Update active state in ls output
   */
  function updateActivePost(url) {
    document.querySelectorAll('.post-item').forEach(item => {
      if (item.dataset.post === url) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  /**
   * Add click handler to back button
   */
  function addBackButtonHandler() {
    const backLink = postViewer.querySelector('.back-link');
    if (backLink) {
      backLink.addEventListener('click', (e) => {
        e.preventDefault();
        showIndex();
        history.pushState(null, '', '/');
      });
    }
  }
  
  /**
   * Initialize event listeners
   */
  function init() {
    // Only initialize dynamic loading if we're on the index page
    const isIndexPage = document.getElementById('post-index') !== null;
    
    if (isIndexPage) {
      // Table post links
      postLinksTable.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.dataset.post;
          const title = link.querySelector('.col-title').textContent.trim();
          showPost(url, title);
          
          // Update URL without page reload
          history.pushState({ post: url }, '', url);
        });
      });
      
      // Left pane ls-style links
      postLinksLs.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.dataset.post;
          const title = link.querySelector('.ls-name').textContent.trim();
          showPost(url, title);
          
          // Update URL without page reload
          history.pushState({ post: url }, '', url);
        });
      });
      
      // Handle browser back/forward
      window.addEventListener('popstate', (e) => {
        if (e.state && e.state.post) {
          showPost(e.state.post, '');
        } else {
          showIndex();
        }
      });
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Escape to go back to index
        if (e.key === 'Escape' && postViewer.classList.contains('active')) {
          showIndex();
          history.pushState(null, '', '/');
        }
      });
      
      // Check if we should load a post on initial load
      const currentPath = window.location.pathname;
      if (currentPath && currentPath !== '/' && currentPath.includes('/posts/')) {
        // Try to load the post
        const postLink = document.querySelector(`[data-post="${currentPath}"]`);
        if (postLink) {
          const title = postLink.querySelector('.col-title, .ls-name')?.textContent.trim() || '';
          showPost(currentPath, title);
        }
      }
    } else {
      // We're on a direct post page - make left pane links work
      postLinksLs.forEach(link => {
        link.addEventListener('click', (e) => {
          const url = link.dataset.post;
          window.location.href = url;
        });
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Terminal effect - random character flicker (subtle)
  function addTerminalEffect() {
    const headers = document.querySelectorAll('.terminal-title, .ascii-logo');
    headers.forEach(header => {
      setInterval(() => {
        const text = header.textContent;
        if (Math.random() > 0.95 && text.length > 0) {
          const pos = Math.floor(Math.random() * text.length);
          const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          
          const newText = text.substring(0, pos) + randomChar + text.substring(pos + 1);
          header.textContent = newText;
          
          setTimeout(() => {
            header.textContent = text;
          }, 50);
        }
      }, 3000);
    });
  }
  
  // Add subtle terminal effect
  setTimeout(addTerminalEffect, 1000);
  
  // Category filter functionality
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('input', function(e) {
      const filterValue = e.target.value.toLowerCase().trim();
      const postItems = document.querySelectorAll('.pane-left .post-item');
      const headerLine = document.querySelector('.pane-left .ls-header');
      
      let visibleCount = 0;
      
      postItems.forEach(item => {
        // Get all categories from data attribute
        const allCategories = item.dataset.categories || '';
        const categoriesLower = allCategories.toLowerCase();
        
        // Get hex filename from displayed text
        const filenameElement = item.querySelector('.ls-name');
        const filename = filenameElement ? filenameElement.textContent.toLowerCase() : '';
        
        // Match if filter matches categories OR filename
        if (filterValue === '' || 
            categoriesLower.includes(filterValue) || 
            filename.includes(filterValue)) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update the "total" count
      if (headerLine) {
        if (filterValue === '') {
          headerLine.textContent = `total ${postItems.length}`;
        } else {
          headerLine.textContent = `total ${visibleCount} (filtered)`;
        }
      }
    });
    
    // Clear filter with Escape key
    categoryFilter.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        e.target.value = '';
        e.target.dispatchEvent(new Event('input'));
        e.target.blur();
      }
    });
  }
  
  // Handle profile picture loading errors
  const profilePic = document.querySelector('.profile-picture');
  const profilePlaceholder = document.querySelector('.profile-placeholder');
  
  if (profilePic) {
    profilePic.addEventListener('error', function() {
      // Hide image and show placeholder if image fails to load
      profilePic.style.display = 'none';
      if (profilePlaceholder) {
        profilePlaceholder.style.display = 'flex';
      }
    });
    
    // Check if image src is valid
    if (!profilePic.src || profilePic.src.includes('profile.png')) {
      // Attempt to load, if it fails, show placeholder
      const img = new Image();
      img.src = profilePic.src;
      img.onerror = function() {
        profilePic.style.display = 'none';
        if (profilePlaceholder) {
          profilePlaceholder.style.display = 'flex';
        }
      };
    }
  }
  
})();
