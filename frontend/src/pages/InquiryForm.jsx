// src/components/InquiryForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const InquiryForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        company: '',
        email: '',
        phone: '',
        project_type: 'web',
        project_description: '',
        preferred_technologies: [],
        budget_range: '<10k',
        timeline: '',
        communication_method: 'email',
        meeting_platform: 'zoom'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collect form data
        const preferredTechnologies = formData.preferredTechnologies.join(',');

        // Prepare form data
        const formPayload = {
            ...formData,
            preferred_technologies
        };

        try {
            // Submit form data
            await axios.post('/api/contact/submit/', formPayload);

            // Show success message
            toast.success('Inquiry submitted successfully!');

            // Reset form
            setFormData({
                full_name: '',
                company: '',
                email: '',
                phone: '',
                project_type: 'web',
                project_description: '',
                preferred_technologies: [],
                budget_range: '<10k',
                timeline: '',
                communication_method: 'email',
                meeting_platform: 'zoom'
            });

            // Navigate to thank you page
            window.location.href = '/thank-you';
        } catch (error) {
            toast.error('Error submitting inquiry. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same */}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Technologies
                </label>
                <div className="flex flex-wrap gap-2">
                    {['React', 'Django', 'Node.js', 'PostgreSQL', 'MongoDB', 'Tailwind CSS'].map((tech) => (
                        <button
                            type="button"
                            className={`px-3 py-1 rounded text-sm ${formData.preferredTechnologies.includes(tech) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                            onClick={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    preferredTechnologies: prev.preferredTechnologies.includes(tech)
                                        ? prev.preferredTechnologies.filter(t => t !== tech)
                                        : [...prev.preferredTechnologies, tech]
                                }));
                            }}
                            key={tech}>
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition duration-300"
            >
                Submit Inquiry
            </button>
        </form>
    );
};

export default InquiryForm;