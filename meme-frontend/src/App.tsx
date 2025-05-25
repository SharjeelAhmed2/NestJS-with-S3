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
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" />
        <button type="submit">Upload</button>
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