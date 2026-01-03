import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectDetails() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`/api/projects/${id}/`)
            .then(response => {
                setProject(response.data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching project details:', error));
    }, [id]);

    if (loading) return <p className="text-center text-gray-300">Loading...</p>;

    if (!project) return <p className="text-center text-red-500">Project not found.</p>;

    return (
        <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-primary mb-12">{project.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-96 object-cover rounded-lg mb-4"
                        />
                        <div className="grid grid-cols-3 gap-4">
                            {/* Example additional pictures; replace with real data */}
                            <img src="https://via.placeholder.com/200" alt="Capability 1" className="w-full h-32 object-cover rounded" />
                            <img src="https://via.placeholder.com/200" alt="Capability 2" className="w-full h-32 object-cover rounded" />
                            <img src="https://via.placeholder.com/200" alt="Capability 3" className="w-full h-32 object-cover rounded" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-4">Description</h3>
                        <p className="text-gray-300 mb-6">{project.description}</p>
                        <h3 className="text-2xl font-semibold text-white mb-4">Technologies Used</h3>
                        <ul className="list-disc list-inside text-gray-300 mb-6">
                            {project.technologies.map((tech, index) => (
                                <li key={index}>{tech}</li>
                            ))}
                        </ul>
                        <h3 className="text-2xl font-semibold text-white mb-4">Capabilities</h3>
                        <p className="text-gray-300">{project.capabilities}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProjectDetails;