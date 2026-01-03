import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Portfolio() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('/api/projects/')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl text-center text-primary mb-12">"One scroll, every spark — code, design, and craft distilled into an immersive journey that moves faster than thought."</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow fixed-h-96 w-80 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
              <Link to={`/projects/${project.id}`} className="text-accent hover:underline">
                View Description
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;