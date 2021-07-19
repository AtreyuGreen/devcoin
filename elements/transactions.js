const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/**
 * Esta clase representa la transacción entre dos wallets, y el dinero aceptado en esta transacción.
 * 
 * NOTA: En bitcoin, todas las transacciones que llegan no entran directamente en el blockchain, sino que
 * entran en un área llamada transacciones pendientes que terminará insertándose dentro cuando 
 * sean validadas.
 * 
 */ 
class Transaction {

    /**
     * C.to
     * @param {string} fromAddress - Es la dirección desde donde se está enviando las monedas
     * @param {string} toAddress - Es la dirección hacia donde se enviarán las monedas
     * @param {string} amount - Es la cantidad de monedas que se enviarán.
     */ 
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    /**
     * Calcula el hash que se va utilizar para firmar esta transacción
     * @returns Devolverá el hash de esta transacción.
     */
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
    }

    /**
     * Se firma la transacción con la clave de firma asociada a la dirección. 
     * Una vez que se ha firmado la transacción no puede ser modificada por otra wallet.
     * La transacción deberá de ser firmada por fromAddress para que sea válida.
     * @param signingKey {EC('secp256k1')} Es el objeto con la llave privada y pública del wallet que firma la transacción.
    */
    signTransaction(signingKey) {
        //Primero tenemos que comprobar que la llave pública es igual a la dirección fromAddress
        //Ya que solamente podemos gastar monedas que venga desde un wallet que tenemos.
        if (signingKey.getPublic('hex') !== this.fromAddress)
            throw new Error("¡No puedes firmar transacciones que vienen de otros wallets");

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex'); ///Esto es para dar un formato especial;
    }

    /**
     * Comprueba si la transacción ha sido firmada por la cuenta que envía las monedas
     * Solamente se ha de verificar que el hash de la transacción es igual que el hash que
     * se puede generar con la llave pública.
     * @returns True si se puede verificar.
     */ 
    isValid() {
        ///Tenemos que recordar que las transacciones de los mineros, vienen de la dirección NULL.
        ///Así que si la dirección fromAddress es null entonces devolvemos que es correcta.
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length == 0)
            throw new Error("No hay firma para esta transacción");

        ///Ahora tenemos que comprobar que la transacción fue firmada con la clave correcta.
        //console.log("["+new Date()+"] "+ this.fromAddress);
        const publickey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publickey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;