# PIXELCRYPT 🕵️‍♂️🖼️

**PixelCrypt** is a professional-grade, browser-based steganography application that allows users to hide AES-encrypted messages within the pixel data of PNG images. By utilizing **Least Significant Bit (LSB)** manipulation, PixelCrypt ensures that secrets remain invisible to the naked eye while being secured by industry-standard encryption.



---

## 🚀 Key Features

- **Algorithmic Steganography:** Custom LSB implementation in vanilla JavaScript to manipulate raw pixel buffers.
- **AES-256 Encryption:** Every message is encrypted before injection, ensuring that even if the bits are extracted, the data remains unreadable without the unique key.
- **Cloud-Linked Identity Keys:** Integrated with **Clerk Auth** to manage unique user encryption keys via public metadata. Users never have to remember their keys; the app handles it.
- **Optimized Performance:** A "fail-fast" decoding loop that checks for magic headers in the first 40 bits to prevent unnecessary O(n) processing on non-encoded images.
- **Themed UI:** Full support for Dark and Light modes with a polished, responsive dashboard.
- **Privacy First:** All image processing happens locally in the browser's Canvas API. No images or messages are ever uploaded to a server.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Encryption:** [Crypto-JS](https://www.npmjs.com/package/crypto-js)
- **Graphics:** HTML5 Canvas API

---

## 🧬 How the Algorithm Works



The core of PixelCrypt lies in **Bitwise Arithmetic**. 

1. **The Encoding Process:**
   - The message is combined with a "Magic Header" (`PCV1:`) and a null terminator (`\0`).
   - The message is encrypted using the user's unique 128-bit key.
   - The algorithm iterates through the image's Red channel. For each pixel, it clears the last bit and replaces it with one bit of the secret message.
   - Since the color value only changes by a maximum of 1 (out of 255), the visual difference is mathematically insignificant ($<0.4\%$).

2. **The Decoding Process:**
   - The decoder harvests the last bit of the Red channel from every pixel.
   - It reconstructs the bits into characters.
   - It performs an early-exit check: if the first few characters do not match `PCV1:`, it immediately halts to save CPU cycles.
   - Once the null terminator is reached, the encrypted string is decrypted back into the original message.

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mrshivamroy/pixel-crypt.git](https://github.com/mrshivamroy/pixel-crypt.git)
   cd pixelcrypt
   ```
2. **Install dependencies:**
  ```bash
  npm install @clerk/nextjs crypto-js
  ```
3. **Configure Environment Variables:**
  Create a `.env.local` file with your Clerk credentials:
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_pub_key
  CLERK_SECRET_KEY=your_sec_key
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  ```
4. **Run Development Server:**
  ```bash
  npm run dev
  ```

## ⚠️ Important Considerations

- **PNG Only:** This application currently supports PNG only. Formats like JPEG use lossy compression which "smudges" pixel values, resulting in the total loss of hidden data.
- **Data Collision:** Encoding a message into an image that already contains a secret will overwrite the existing data.
- **Capacity:** The maximum message length is determined by the total pixel count of the uploaded image ($Width \times Height / 8$).

---

## 📖 Tutorial
Need help? Check out the in-app Tutorial Page (/tutorial) for a step-by-step guide on how to hide and reveal secrets using the dashboard.

---
