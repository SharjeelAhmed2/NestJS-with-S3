import React, { useEffect, useState } from 'react';
import { createMeme, getMemes } from './api/api';

function App() {
  const [memes, setMemes] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMeme({ title, imageUrl: url });
    const res = await getMemes();
    setMemes(res.data);
  };

  useEffect(() => {
    getMemes().then((res) => setMemes(res.data));
  }, []);

  return (
    <div>
      <h1>Meme Uploader</h1>
     <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-start p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meme Title"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
      >
        Upload Meme
      </button>
</form>
      <ul>
        {memes.map((meme: any, index) => (
          <li key={index}>
            <h3>{meme.title}</h3>
            <img src={meme.imageUrl} alt={meme.title} width="200" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;