const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/**
 * Esta clase representa el bloque de la cadena.
 */ 
class Block{
    
    /**
     * C.to
     * @param {Array[Transaction]} transactions - Son las transacciones de este bloque
     * @param {string} previousHash - Es la dirección hash del bloque anterior.
     */    
    constructor(transactions, previousHash = ''){
        this.date = new Date();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.createHash();
        this.nonce = 0; //Este es el número que se utiliza para generar un hash que cumpla una condición concreta.
                        //que ha de tener un número determinado de ceros. 
                        //Este número se cambiará hasta que coincida con el criterio establecido.
    }

    /**
    * Creará un hash a partir de los datos pasados al bloque.
    * @returns El hash del bloque con varios parámetros.
    */     
    createHash(){
        ///Si no ponemos toString nos devolverá el hash dividido en diferentes números.
        return SHA256(this.date + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    /**
     * Buscará el nonce que haga un hash que tenga tantos ceros como indiquemos en la dificultad.
     */
    mine(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.createHash();
        }
    }

    /**
     * Comprueba si todas las transacciones son o no válidas.
     * @returns Devolverá True si es correcto o no el bloque
     */ 
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

module.exports.Block = Block;