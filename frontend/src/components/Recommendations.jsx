import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (Cookies.get('ai_features') === 'disabled') return;

    const viewedPages = JSON.parse(localStorage.getItem('viewedPages') || '[]');
    axios
      .post('/api/recommend/', { viewed: viewedPages })
      .then((response) => setRecommendations(response.data.recommendations || []))
      .catch((error) => console.error('Error getting recommendations:', error));
  }, []);

  return (
    <section className="py-8 bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">Recommended for You</h2>
      {recommendations.length === 0 ? (
        <p className="text-center text-gray-300">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl text-white">{rec.title}</h3>
              <p className="text-gray-300">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Recommendations;