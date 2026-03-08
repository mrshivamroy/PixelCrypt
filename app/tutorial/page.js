"use client";
import Link from 'next/link';

export default function Tutorial() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-2xl mx-auto py-12">
        <Link href="/" className="inline-block mb-8 text-blue-600 font-bold hover:underline">← Back to App</Link>
        
        <h1 className="text-4xl font-black mb-6">How to use PixelCrypt</h1>
        <p className="text-lg text-slate-600 mb-10">PixelCrypt lets you hide secret text inside a normal-looking photo. To everyone else, it’s just a picture. To you, it’s a secret message.</p>

        <div className="space-y-10">
          <section className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Hiding a Message</h2>
              <p className="text-slate-600 leading-relaxed">
                Stay on the <strong>HIDE</strong> tab. Type your secret message into the big text box. Then, click the big blue button and choose a <strong>PNG</strong> image from your computer. 
                <br /><br />
                The website will automatically download a <em>new</em> version of that image. It looks exactly the same, but your message is now hidden inside!
              </p>
            </div>
          </section>

          <section className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Reading a Hidden Message</h2>
              <p className="text-slate-600 leading-relaxed">
                Switch to the <strong>REVEAL</strong> tab. Click the big blue button and upload the secret image you (or someone using your account) created earlier. 
                <br /><br />
                The secret text will instantly appear in the blue box!
              </p>
            </div>
          </section>

          <section className="flex gap-6 border-t pt-10 mt-10">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">!</div>
            <div>
              <h2 className="text-xl font-bold mb-2 italic text-yellow-600">Golden Rule: Use PNG Only</h2>
              <p className="text-slate-600 leading-relaxed">
                Currently, this tool only works with <strong>PNG</strong> images. If you use a JPG or a photo from a phone camera directly, the secret data might get "smudged" and lost.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-16 text-center text-slate-400 text-sm">
          No messages are stored on our servers. Your secrets stay in your images.
        </footer>
      </div>
    </main>
  );
}