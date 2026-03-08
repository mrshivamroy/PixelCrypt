"use client";
import { useState, useEffect, useRef } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { encodeMessage, decodeMessage } from '@/utils/steganography';

export default function PixelCryptHome() {
  const [mode, setMode] = useState("encode");
  const [theme, setTheme] = useState("dark");
  const [message, setMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [userKey, setUserKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/api/setup-key').then(res => res.json()).then(data => setUserKey(data.key));
  }, []);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");
  const isDark = theme === "dark";

  const processImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try {
          if (mode === "encode") {
            if (!message) throw new Error("Please type a message first!");
            const encoded = encodeMessage(imgData, message, userKey);
            ctx.putImageData(encoded, 0, 0);
            const link = document.createElement('a');
            link.download = 'pixelcrypt_secret.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
          } else {
            const secret = decodeMessage(imgData, userKey);
            setDecodedMessage(secret);
          }
        } catch (err) { alert(err.message); }
        finally { setLoading(false); e.target.value = ""; }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 p-6 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-black tracking-tighter text-blue-500">PIXELCRYPT</h1>
          <Link href="/tutorial" className={`text-sm font-bold px-3 py-1 rounded-full border ${isDark ? "border-slate-800 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-100"}`}>
            Guide & Tutorial
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className={`p-2 rounded-full border ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-300 bg-white shadow-sm"}`}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
        <div className={`lg:col-span-2 space-y-6 p-8 rounded-3xl shadow-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-[10px] uppercase tracking-widest font-black text-center">
            Development Mode: Use PNG format only for perfect data recovery
          </div>

          <div className={`flex p-1 rounded-xl ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
            <button onClick={() => setMode("encode")} className={`flex-1 py-3 rounded-lg transition-all ${mode === "encode" ? (isDark ? "bg-slate-700 text-white shadow-lg" : "bg-white shadow-md font-bold") : "text-gray-500"}`}>HIDE MESSAGE</button>
            <button onClick={() => {setMode("decode"); setDecodedMessage("");}} className={`flex-1 py-3 rounded-lg transition-all ${mode === "decode" ? (isDark ? "bg-slate-700 text-white shadow-lg" : "bg-white shadow-md font-bold") : "text-gray-500"}`}>REVEAL MESSAGE</button>
          </div>

          {mode === "encode" ? (
            <textarea className={`w-full h-40 p-4 border rounded-2xl outline-none text-lg transition-colors ${isDark ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-400" : "bg-white border-gray-200 text-slate-900 focus:ring-blue-500"}`} placeholder="What is your secret?..." value={message} onChange={(e) => setMessage(e.target.value)} />
          ) : (
            <div className={`p-6 rounded-2xl min-h-[160px] flex flex-col justify-center border ${isDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"}`}>
              <span className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">Secret Message Found:</span>
              <p className={`text-xl font-medium break-words ${isDark ? "text-blue-100" : "text-blue-900"}`}>{decodedMessage || "Upload a PixelCrypt PNG to see the magic..."}</p>
            </div>
          )}

          <div className="relative">
            <input type="file" accept="image/png" onChange={processImage} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="block w-full text-center bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg cursor-pointer hover:bg-blue-500 transition-all active:scale-[0.95]">
              {loading ? "PROCESSING..." : mode === "encode" ? "UPLOAD IMAGE & HIDE" : "UPLOAD IMAGE & DECODE"}
            </label>
          </div>
        </div>

        {/* Previous Structure for Identity Key */}
        <div className={`p-8 rounded-3xl shadow-2xl flex flex-col justify-between h-full ${isDark ? "bg-slate-900 border border-slate-800" : "bg-slate-950 text-white"}`}>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Identity Key</h2>
              <button onClick={() => setShowKey(!showKey)} className="text-[10px] uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-700">
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">This unique key is stored in your profile. Only you can decode images created with this key.</p>
            <div className="bg-black/50 p-4 rounded-xl border border-slate-800 break-all font-mono text-[10px] text-blue-400">
              {showKey ? (userKey || "Loading key...") : "••••••••••••••••••••••••••••••••"}
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-800">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">System Info</h3>
             <p className="text-xs text-slate-400 mt-2 italic">Encryption Active. Data hidden in pixel Red-LSB channel.</p>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}