const EC = require('elliptic').ec; ///Nos sirve para firmar y validar.

const ec = new EC('secp256k1'); ///podemos utilizar el elliptic que deseemos pero aquí vamos a utilizar este.
                                ///Este es el algoritmo básico que tiene los wallets de Bitcoin

const key = ec.genKeyPair();

///Generamos la llave pública y privada en primer lugar en hexadecimal
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log(); //con esto generamos una línea en blanco.
console.log("Llave privada:", privateKey);

console.log(); //con esto generamos una línea en blanco.
console.log("Llave pública:", publicKey);