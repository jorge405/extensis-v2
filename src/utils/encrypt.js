import * as CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'); // 256 bits key
const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210'); // 128 bits IV

export const encrypt = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
    return {
        encryptedData: encrypted.toString(),
        iv: iv.toString(CryptoJS.enc.Hex),
        key: key.toString(CryptoJS.enc.Hex)
    };
};

export const decrypt = (encryptedData, ivHex, keyHex) => {
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
};