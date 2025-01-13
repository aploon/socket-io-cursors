import React from 'react';
import { MousePointer2 } from 'lucide-react';
import { CursorPosition } from '../types/cursor';

interface CursorProps {
  cursor: CursorPosition;
}

const Cursor: React.FC<CursorProps> = ({ cursor }) => {
  return (
    <div
      className="absolute pointer-events-none transition-all duration-100 ease-out"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <MousePointer2 className="w-6 h-6 text-indigo-500" />
      <div className="mt-1 px-2 py-1 bg-indigo-500 text-white text-sm rounded-md whitespace-nowrap">
        {cursor.hostname}
      </div>
    </div>
  );
}

export default Cursor;