import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

process.env.PUBLIC_KEY = publicKey;
process.env.PRIVATE_KEY = privateKey;

const publicKeyPen = publicKey.export({ type: "spki", format: "pem" });
console.log("Chave pública:", publicKeyPen);

const privateKeyPen = privateKey.export({ type: "pkcs8", format: "pem" });
console.log("Chave privada:", privateKeyPen);

const jsonInfoToIncript = {
  id: "f0e68aba-fa7c-4214-b6d4-abce90769c03",
  name: "Darlei Matheus Schmegel",
  cpf: "12345678901",
};

// Mensagem que você quer criptografar
const message = JSON.stringify(jsonInfoToIncript);

// Criptografa a mensagem usando publicKeyPen
const encryptedMessage = crypto.publicEncrypt(
  publicKeyPen,
  Buffer.from(message)
);

// Sua mensagem criptografada em base64
const base64Message = encryptedMessage.toString("base64");

console.log("Mensagem criptografada em base64:", base64Message);
