import { readFileSync, writeFileSync } from "fs";
import QRCode from "qrcode";
import crypto from "crypto";
import pkg from "react-native-rsa-native";
const { RSA } = pkg;
// Gera um par de chaves
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
console.log("Chave pública:", publicKey);

//exporta a chave pública e privada
const publicKeyPen = publicKey.export({ type: "spki", format: "pem" });
// exporta a chave privada
const privateKeyPen = privateKey.export({ type: "pkcs8", format: "pem" });

// gerar arquivo com chave publica
writeFileSync("public.pem", publicKeyPen);
// gerar arquivo com chave privada
writeFileSync("private.pem", privateKeyPen);

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
const decryptedMessage = RSA.decrypt(base64Message, privateKeyPen);

console.log("Mensagem descriptografada:", JSON.parse(decryptedMessage));

// Gera a URL de dados do QR Code
const dataUrl = await QRCode.toDataURL(base64Message);

// console.log(dataUrl);
