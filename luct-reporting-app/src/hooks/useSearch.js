import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering a list by a search query.
 * Searches across multiple string fields of each item.
 *
 * @param {Array} data - The full list of items
 * @param {Array<string>} searchFields - Keys to search against
 * @param {string} initialQuery - Starting search text
 * @returns {{ query: string, setQuery: Function, filteredData: Array }}
 */
export default function useSearch(data, searchFields, initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;

    const lowerQuery = query.toLowerCase().trim();

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (!value) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, query, searchFields]);

  return { query, setQuery, filteredData };
}