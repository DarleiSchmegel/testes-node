import crypto from "crypto";

// Gera uma chave AES aleatória
const aesKey = crypto.randomBytes(32);

// Cria um cipher usando a chave AES
const cipher = crypto.createCipheriv(
  "aes-256-cbc",
  aesKey,
  Buffer.alloc(16, 0)
);

const jsonInfoToIncript = {
  id: "f0e68aba-fa7c-4214-b6d4-abce90769c03",
  name: "Darlei Matheus Schmegel",
  cpf: "12345678901",
};

// Criptografa os dados com a chave AES
const encryptedData = Buffer.concat([
  cipher.update(JSON.stringify(jsonInfoToIncript), "utf8"),
  cipher.final(),
]);

console.log("Dados criptografados:", encryptedData.toString("base64"));

// Cria um decipher usando a chave AES
const decipher = crypto.createDecipheriv(
  "aes-256-cbc",
  aesKey,
  Buffer.alloc(16, 0)
);

// Descriptografa os dados com a chave AES
const decryptedData = Buffer.concat([
  decipher.update(encryptedData),
  decipher.final(),
]).toString("utf8");

console.log("Dados descriptografados:", decryptedData);
