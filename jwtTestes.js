const jwt = require("jsonwebtoken");

// Chave privada
const privateKey =
  process.env.NEXT_PRIVATE_KEY_TO_INCRIPTY_TICKET || "privateKeysffsf";

// Função para criptografar a string
function encryptString(stringToEncrypt) {
  if (!privateKey) {
    console.log("Chave privada não definida");
    return null;
  }

  console.log("stringToEncrypt", stringToEncrypt);
  const token = jwt.sign(stringToEncrypt, privateKey);
  console.log("token", token);
  return token;
}

// Função para descriptografar a string
function decryptString(token) {
  if (!privateKey) {
    console.log("Chave privada não definida");
    return null;
  }

  try {
    const decoded = jwt.verify(token, privateKey);
    return decoded && decoded.toString();
  } catch (err) {
    console.log("Falha ao descriptografar a string", err);
    return null;
  }
}

encryptString({
  id: 1,
  name: "João",
  email: "",
});
