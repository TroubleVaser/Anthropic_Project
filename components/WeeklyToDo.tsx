
import React, { useState } from 'react';
import { WeeklyTask } from '../types';
import { RunIcon, HeartIcon, StarIcon, BrainIcon } from './icons/NavIcons';

const InitialTasks: WeeklyTask[] = [
  { id: 1, text: 'Exercise for 30 minutes', completed: false, icon: RunIcon },
  { id: 2, text: 'Show gratitude to someone', completed: true, icon: HeartIcon },
  { id: 3, text: 'Do something that makes you happy', completed: false, icon: StarIcon },
  { id: 4, text: 'Practice yoga or mindfulness', completed: false, icon: BrainIcon },
];

const WeeklyToDo: React.FC = () => {
  const [tasks, setTasks] = useState(InitialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-full">
      <h2 className="text-xl font-semibold mb-4 text-green-300">Mental Wealth To-Do</h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/80 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
              {task.text}
            </span>
            <task.icon className={`w-6 h-6 ${task.completed ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyToDo;
