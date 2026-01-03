import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (Cookies.get('ai_features') === 'disabled') return;

    try {
      const response = await axios.post('/api/nlp-search/', { query });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about projects..."
        className="p-2 bg-gray-800 text-white rounded"
      />
      <button onClick={handleSearch} className="bg-accent p-2 rounded">
        Search
      </button>
      {results.map((result) => (
        <div key={result.id} className="mt-2 bg-gray-700 p-4 rounded">
          <h3 className="text-xl text-white">{result.title}</h3>
          <p className="text-gray-300">{result.description}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchBar;