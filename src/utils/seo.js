// src/utils/seo.js
export const updateSEO = ({ title, description, keywords }) => {
  // 1. Update Page Title
  if (title) document.title = title;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  if (description) metaDesc.content = description;

  // 3. Update Meta Keywords
  let metaKey = document.querySelector('meta[name="keywords"]');
  if (!metaKey) {
    metaKey = document.createElement('meta');
    metaKey.name = 'keywords';
    document.head.appendChild(metaKey);
  }
  if (keywords) metaKey.content = keywords;
};