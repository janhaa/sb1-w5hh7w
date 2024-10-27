import React, { useState } from 'react';
import Editor from './components/Editor';
import ViewMode from './components/ViewMode';
import { Eye, Edit2 } from 'lucide-react';

function App() {
  const [isEditMode, setIsEditMode] = useState(true);
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'paragraph' as const, content: 'Start typing here...' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Block Editor</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isEditMode ? (
                  <>
                    <Eye size={16} />
                    <span>Preview</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        {isEditMode ? (
          <Editor initialBlocks={blocks} onChange={setBlocks} />
        ) : (
          <ViewMode blocks={blocks} />
        )}
      </main>
    </div>
  );
}

export default App;