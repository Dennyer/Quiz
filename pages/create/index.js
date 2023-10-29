import Link from 'next/link';
import { useState } from 'react';

export default function Create() {
  const [name, setName] = useState('');

  const createQuiz = () => {
    const sanitizedFileName = encodeURIComponent(name.replace(/\s+/g, '_').replace(/[^\w\s]/gi, ''));
  
    if (!sanitizedFileName || sanitizedFileName.includes('..') || sanitizedFileName.includes('/')) {
      console.error('Invalid or empty sanitized file name');
      return;
    }
  
    window.location.href = encodeURI(`/create/${sanitizedFileName}/1`);
  };
  

  return (
    <div className="flex h-screen flex-col items-center justify-center dark:bg-darkmode-1000">
      <div className="relative flex flex-col items-center space-y-16">
        <input
          type="text"
          placeholder="Enter Questionnaire Name"
          value={name}
          pattern="[A-Za-z0-9 ]*"
          onChange={(e) => setName(e.target.value)}
          className="inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        />
        <button 
          type="button"
          onClick={createQuiz} 
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create
        </button>
      </div>
    </div>
  );
}
