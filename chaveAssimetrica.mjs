import QRCode from "qrcode";
import crypto from "crypto";

// Gera um par de chaves
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
console.log("Chave pública:", publicKey);
const jsonInfoToIncript = {
  id: "f0e68aba-fa7c-4214-b6d4-abce90769c03",
  name: "Darlei Matheus Schmegel",
  cpf: "12345678901",
};
// Mensagem que você quer criptografar
const message = JSON.stringify(jsonInfoToIncript);

// Criptografa a mensagem
const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));

// Sua mensagem criptografada em base64
const base64Message = encryptedMessage.toString("base64");

console.log("Mensagem criptografada em base64:", base64Message);

// Descriptografa a mensagem
const decryptedMessage = crypto.privateDecrypt(privateKey, encryptedMessage);

console.log(
  "Mensagem descriptografada:",
  JSON.parse(decryptedMessage.toString())
);

// Gera a URL de dados do QR Code
const dataUrl = await QRCode.toDataURL(base64Message);

// console.log(dataUrl);
