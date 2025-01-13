import React, { useEffect, useState, useCallback } from 'react';
import { socket } from './socket';
import { CursorPosition } from './types/cursor';
import Cursor from './components/Cursor';
import { Users, X } from 'lucide-react';

function App() {
  const [cursors, setCursors] = useState<Array<CursorPosition>>([]);
  const [hostname, setHostname] = useState<string>(() =>
    `User-${Math.random().toString(36).substr(2, 6)}`
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!socket.connected) return;
    const currentCursorPosition: CursorPosition = {
      id: socket.id,
      x: e.clientX,
      y: e.clientY,
      hostname: hostname,
    };
    socket.emit('cursorMove', currentCursorPosition, (res: CursorPosition[]) => {
      setCursors(res);
    });
  }, [hostname]);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('cursorMove', (updatedCursors: CursorPosition[]) => {
      setCursors(updatedCursors);
    });

    window.addEventListener('mousemove', handleMouseMove);

    socket.connect();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Cursor Tracker</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 font-medium">
              {Object.keys(cursors).length} active users
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-24 px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real-time Cursor Tracking
          </h2>
          <p className="text-lg text-gray-600">
            Move your cursor around to see it tracked in real-time. You can see other users' cursors too!
          </p>
        </div>

        {/* Cursors */}
        {cursors.map((cursor) => (
          <Cursor key={cursor.id} cursor={cursor} />
        ))}
      </main>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <p className="text-gray-600 text-center">
            Your hostname: <span className="font-semibold text-indigo-600">{hostname}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;