import crypto from "crypto";

// Use a fixed key from env or a fallback for development. Must be 32 bytes (256 bits).
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; 
const IV_LENGTH = 16; 

export function encrypt(text) {
  if (!text) return null;
  try {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
}

export function decrypt(text) {
  if (!text) return null;
  try {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return null;
  }
}
