/**
 * Storage utility with expiration support
 */

interface StorageItem<T> {
  value: T;
  expiry: number;
}

/**
 * Set an item in localStorage with expiration
 * @param key Storage key
 * @param value Value to store
 * @param ttl Time to live in milliseconds (default: 7 days)
 */
export const setWithExpiry = <T>(key: string, value: T, ttl = 7 * 24 * 60 * 60 * 1000): void => {
  const item: StorageItem<T> = {
    value,
    expiry: new Date().getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get an item from localStorage with expiration check
 * @param key Storage key
 * @returns The stored value or null if expired or not found
 */
export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  // Return null if item doesn't exist
  if (!itemStr) {
    return null;
  }
  
  try {
    const item: StorageItem<T> = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Compare the expiry time with the current time
    if (now > item.expiry) {
      // If the item is expired, remove it from storage and return null
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (e) {
    console.error('Error parsing stored item:', e);
    return null;
  }
};

/**
 * Remove an item from localStorage
 * @param key Storage key
 */
export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};
