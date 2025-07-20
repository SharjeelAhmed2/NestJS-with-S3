import React, { useEffect, useState } from 'react';
import { createMeme, getS3Memes, deleteMeme, getUserMemes } from '../api/api';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const generateCaption = async (index: number, title: string) => {
    try {
      const response = await axios.post('http://localhost:3001/gpt', {
        prompt: `Write a fun or clever caption for: ${title}`,
      });

      const caption = response.data.response;

      // Update specific meme object with new caption
      setMemes((prev: any[]) =>
        prev.map((m, i) => (i === index ? { ...m, caption } : m))
      );
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error("Couldn't fetch the caption");
    }
  };


  type Meme = {
  title: string;
  imageUrl: string;
};

  const [memes, setMemes] = useState<Meme[]>([]);
  //const [memes, setMemes] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    await createMeme(formData);
    const res = await getUserMemes();
    setMemes(res.data);
  };
  const formatTitle = (raw: string) => {
    return raw
      .replace(/_/g, ' ')
      .replace(/\.+$/, '') // removes trailing dots
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words
  };

  const extractTitle = (filename: string) => {
    const match = filename.split('--')[2]?.split('.')[0];
    return formatTitle(match || 'Untitled');
  };
  useEffect(() => {
     const fetchMemes = async () => {
      const res = await getUserMemes();
      console.log("Got images from backend:", res.data);
      //let titleOfImage = extractTitle(res.data)
      // setMemes(res.data.map((url: any) => ({
      //   title: titleOfImage,    
      //   imageUrl: url,
      // })));
      
    const mappedMemes = res.data.map((url: string) => {
      const filename = url.split('/').pop() || '';
      const title = extractTitle(filename);
      return {
        title,
        imageUrl: url,
      };
    });

    setMemes(mappedMemes);
  };
 //     console.log(memes);
    fetchMemes();
  }, []);

  // delete 
  const getKeyFromUrl = (url: string) => {
  return url.split('/').pop() || '';
  };

  // Undo Functionality 

    const handleDelete = (imageUrl: string, title: string) => {
    const key = getKeyFromUrl(imageUrl);
  
    const confirmDelete = window.confirm("Are you sure you want to delete this meme?");
    if (!confirmDelete) return;
  // 1. Remove from UI immediately
  setMemes((prev: any[]) =>
    prev.filter((m: any) => getKeyFromUrl(m.imageUrl) !== key)
  );

  // Step 2: schedule S3 deletion
  const timeoutId = setTimeout(async () => {
    await deleteMeme(key);
    toast.success("Meme permanently deleted");
  }, 5000);

  // Step 3: show toast with Undo
  toast((t) => (
    <span>
      <strong>{title}</strong> deleted
      <button
        className="ml-2 text-blue-500 underline"
        onClick={() => {
          clearTimeout(timeoutId);
          setMemes((prev) => [...prev, { title, imageUrl }]); // bring back meme
          toast.dismiss(t.id);
        }}
      >
        Undo
      </button>
    </span>
  ), {
    duration: 5000,
  });
};
const navigate = useNavigate();
  return (
      <>  <Toaster position="bottom-right" />
<div className="min-h-screen bg-gray-100 py-10 px-8">
  <div className="flex justify-between items-center mb-8">
    <button
      onClick={() => navigate('/gallery')}
      className="px-10 py-1 bg-purple-600 text-white text-sm rounded hover:bg-black"
    >
      Gallery
    </button>

    <button
      onClick={() => navigate('/login')}
      className="px-10 py-1 bg-purple-600 text-white text-sm rounded hover:bg-black"
    >
      Logout
    </button>
  </div>
    <h1 className="text-3xl font-bold text-center mb-8">Image Uploader</h1>
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
        Upload Image
      </button>
</form>
 <div className="...">
  <div className="max-w-4xl mx-auto px-4 mt-10">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Uploaded Images</h2>
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {memes.map((meme: any, index: number) =>{const key = getKeyFromUrl(meme.imageUrl); 
      
      return (
        <div key={index} className="w-64 bg-gray-100 p-2 m-2 rounded flex flex-col justify-between min-h-[16rem]">
         
          <img
            src={meme.imageUrl}
            alt={"S3 Image"}
            className="w-full h-auto object-contain mt-2"
          />
          <p className="break-words text-center font-semibold">
            {meme.title}
          </p>
          {meme.caption ? (
            <p className="mt-2 italic text-sm text-gray-600">{meme.caption}</p>
          ) : (
            <button
              onClick={() => generateCaption(index, meme.title)}
              className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Ask ChatGPT to provide description
            </button>
          )}
         <button
          onClick={() => handleDelete(meme.imageUrl, meme.title)}
          className="mt-2 px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Delete
        </button>
        </div>
      )})}
    </div>
  </div>
</div>
    </div>
  </>);
}