import React, { useEffect, useState } from 'react';
import { createMeme, getS3Memes } from './api/api';

function App() {
  const [memes, setMemes] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    await createMeme(formData);
    const res = await getS3Memes();
    setMemes(res.data);
  };

  useEffect(() => {
     const fetchMemes = async () => {
      const res = await getS3Memes();
      console.log("Got images from backend:", res.data);
      setMemes(res.data.map((url: any) => ({
        title: '', // or extract from filename to do 
        imageUrl: url,
      })));
 //     console.log(memes);
    };
    fetchMemes();
  }, []);

  return (
<div className="min-h-screen bg-gray-100 py-10">
  <h1 className="text-3xl font-bold text-center mb-8">Meme Uploader</h1>
  <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4 items-start p-6 bg-white rounded-lg shadow-md max-w-md mx-auto"
  >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meme Title"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
      >
        Upload Meme
      </button>
</form>
 <div className="...">
  <div className="max-w-4xl mx-auto px-4 mt-10">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Uploaded Memes</h2>
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {memes.map((meme: any) => (
        <div key={meme.imageUrl} className="w-64 h-64 bg-gray-100 p-2 m-2 rounded">
         
          <img
            src={meme.imageUrl}
            alt={"S3 Image"}
            className="w-full h-auto object-contain mt-2"
          />
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}

export default App;