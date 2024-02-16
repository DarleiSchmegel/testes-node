import JSEncrypt from 'jsencrypt';

let encryptor = new JSEncrypt.JSEncrypt();

// Definir chave pública
encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----
... sua chave pública aqui ...
-----END PUBLIC KEY-----`);

let message = 'Mensagem secreta';
let encryptedMessage = encryptor.encrypt(message);

console.log('Mensagem criptografada:', encryptedMessage);

// Definir chave privada
encryptor.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
... sua chave privada aqui ...
-----END RSA PRIVATE KEY-----`);

let decryptedMessage = encryptor.decrypt(encryptedMessage);

console.log('Mensagem descriptografada:', decryptedMessage);