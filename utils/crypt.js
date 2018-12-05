
const cryptoJS = require("crypto-js")

function encrypt (msg, pass) {
    var keySize = 256;
    var iterations = 100;

    var salt = cryptoJS.lib.WordArray.random(128/8);
    
    var key = cryptoJS.PBKDF2(pass, salt, {
        keySize: keySize/32,
        iterations: iterations
      });

    var iv = cryptoJS.lib.WordArray.random(128/8);
    
    var encrypted = cryptoJS.AES.encrypt(msg, key, { 
      iv: iv, 
      padding: cryptoJS.pad.Pkcs7,
      mode: cryptoJS.mode.CBC
    });
    
    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
    return transitmessage;
  }

function decrypt(transitmessage, pass) {
    var keySize = 256;
    var iterations = 100;

    var salt = cryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = cryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);
    
    var key = cryptoJS.PBKDF2(pass, salt, {
        keySize: keySize/32,
        iterations: iterations
    });
  
    var decrypted = cryptoJS.AES.decrypt(encrypted, key, { 
        iv: iv, 
        padding: cryptoJS.pad.Pkcs7,
        mode: cryptoJS.mode.CBC
    })
    
    return decrypted.toString(cryptoJS.enc.Utf8);
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}