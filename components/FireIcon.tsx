// components/icons/FireIcon.tsx
import React from 'react';

interface FireIconProps {
    size?: number | string;
    className?: string;
    color?: string;
}

export const FireIcon: React.FC<FireIconProps> = ({
    size = 24,
    className = "",
    color = "currentColor"
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            stroke={color}
            strokeWidth="0.5"
            className={`drop-shadow-lg ${className}`}
        >
            <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
            <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
            <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
        </svg>
    );
};

export default FireIcon;