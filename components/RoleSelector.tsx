
import React from 'react';
import { Role } from '../types';
import { Bus, User } from 'lucide-react';

interface RoleSelectorProps {
    onSelectRole: (role: Role) => void;
}

const RoleButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    description: string;
}> = ({ onClick, icon, label, description }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center space-x-4"
    >
        <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    </button>
);

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome!</h1>
            <p className="text-center text-gray-500 mb-8">Please select your role to continue.</p>
            <div className="space-y-4">
                <RoleButton
                    onClick={() => onSelectRole(Role.STUDENT)}
                    icon={<User size={24} />}
                    label="I'm a Student"
                    description="Request and track your bus."
                />
                <RoleButton
                    onClick={() => onSelectRole(Role.DRIVER)}
                    icon={<Bus size={24} />}
                    label="I'm a Driver"
                    description="Share your bus location."
                />
            </div>
        </div>
    );
};

// Simple fade-in animation using Tailwind config (not possible here, so CSS-in-JS style is used for keyframes, but it's just for demo)
// In a real project, this would be in tailwind.config.js
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default RoleSelector;
