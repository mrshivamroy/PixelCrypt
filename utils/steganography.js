import CryptoJS from "crypto-js";

const HEADER = "PCV1:";

export const encodeMessage = (imageData, message, key) => {
  const data = imageData.data;
  // Encrypt message with user's unique key
  const encrypted = CryptoJS.AES.encrypt(message, key).toString();
  const finalMessage = HEADER + encrypted + '\0';

  const maxBytes = (data.length / 4) / 8;
  if (finalMessage.length > maxBytes) {
    throw new Error(`Message too long. Max characters for this image: ${Math.floor(maxBytes)}`);
  }

  let charIdx = 0;
  let bitIdx = 0;

  for (let i = 0; i < data.length && charIdx < finalMessage.length; i += 4) {
    const charCode = finalMessage.charCodeAt(charIdx);
    const bit = (charCode >> bitIdx) & 1;
    
    // Inject into Red Channel LSB
    data[i] = (data[i] & ~1) | bit;

    bitIdx++;
    if (bitIdx === 8) {
      bitIdx = 0;
      charIdx++;
    }
  }
  return imageData;
};

export const decodeMessage = (imageData, key) => {
  const data = imageData.data;
  let fullString = '';
  let charCode = 0;
  let bitIdx = 0;

  for (let i = 0; i < data.length; i += 4) {
    const bit = data[i] & 1;
    charCode |= (bit << bitIdx);
    bitIdx++;

    if (bitIdx === 8) {
      const char = String.fromCharCode(charCode);
      fullString += char;
      
      // Optimization: Fail-fast if header doesn't match
      if (fullString.length === HEADER.length && fullString !== HEADER) {
        throw new Error("No hidden message found in this image.");
      }

      if (charCode === 0) break; 
      bitIdx = 0;
      charCode = 0;
    }
  }

  const encryptedPart = fullString.replace(HEADER, "").replace('\0', "");
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPart, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error();
    return originalText;
  } catch (e) {
    throw new Error("Wrong key or corrupted data. This message isn't for you!");
  }
};