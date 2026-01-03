// src/components/ProjectDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectDashboard = ({ projectId }) => {
    const [stages, setStages] = useState([]);
    const [currentStage, setCurrentStage] = useState('');
    const [tasks, setTasks] = useState([]);
    const [changeRequests, setChangeRequests] = useState([]);

    useEffect(() => {
        // Fetch project stages
        axios.get('/api/stages/')
            .then(response => setStages(response.data));

        // Fetch project tasks
        axios.get(`/api/tasks/?project=${projectId}`)
            .then(response => setTasks(response.data));

        // Fetch change requests
        axios.get(`/api/change-requests/?project=${projectId}`)
            .then(response => setChangeRequests(response.data));
    }, [projectId]);

    const updateStage = (stageId) => {
        axios.put(`/api/projects/${projectId}/`, { current_stage: stageId })
            .then(() => setCurrentStage(stageId));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Project Dashboard</h2>

            {/* Stage Progress */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Current Stage</h3>
                <div className="flex space-x-2">
                    {stages.map(stage => (
                        <button
                            key={stage.id}
                            onClick={() => updateStage(stage.id)}
                            className={`px-4 py-2 rounded ${currentStage === stage.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            {stage.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Tasks</h3>
                <ul className="space-y-2">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between p-2 border rounded">
                            <span>{task.title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {task.completed ? 'Completed' : 'Pending'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Change Requests Section */}
            <div>
                <h3 className="font-semibold mb-2">Change Requests</h3>
                <ul className="space-y-2">
                    {changeRequests.map(request => (
                        <li key={request.id} className="p-2 border rounded">
                            <div className="font-medium">{request.description}</div>
                            <div className="text-sm text-gray-600">
                                Priority: {request.priority} | Status: {request.status}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectDashboard;