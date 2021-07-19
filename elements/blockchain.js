const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Block } = require('./blocks');
const { Transaction } = require('./transactions');

class BlockChain{
    /**
     * C.to
     * @param {string} genesis - Es una cadena que utilizamos para generar el bloque.
     * @param {int} difficulty - Es el número de ceros con el comienza el hash del bloque para que sea válido.
     */ 
    constructor(genesis, difficulty = 2){
        this.pendingTransactions = [];
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
        this.miningReward = 100; 
    }

    /**
     * Creará un block inicial
     * @param {string} genesis - Es una cadena que utilizamos para generar el bloque.
     */ 
    createFirstBlock(genesis){
        return new Block([], genesis); ///En bitcoin fue un trozo de una noticia: "El Canciller (británico) está considerando un segundo programa de rescate a la banca".
    }

    /**
     * Buscará el útlimo bloque creado.
     * @returns Devuelve el último bloque creado.
     */ 
     getLastBlock(){
        return this.chain[this.chain.length-1];
    }

    /**
     * Minará todas las transacciones pendientes y creará una nueva transacción de recompensa.
     * Esta transacción, será una transacción donde la dirección From será null.
     * @param {string} miningRewardAddress - Es la dirección de recompensa. 
     */ 
    minePendingTransactions(miningRewardAddress){
        ///Cambiamos el código con respecto al anterior para garantizar que tenemos la transacción
        ///pendiente en el bloque que minamos.
        ///Primero comprobamos que haya transacciones, sino hay transacciones no se puede minar nada.
        if(!this.pendingTransactions || this.pendingTransactions.length === 0)
            return;

        const txRewards = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(txRewards);

        let block = new Block(this.pendingTransactions, this.getLastBlock().hash);
        block.mine(this.difficulty);
        console.log("Bloque minado correctamente!!!");

        this.chain.push(block);

        this.pendingTransactions = [];

    }

    /**
     * Añadirá una transacción a las transacciones pendientes.
     * @param {Transaction} transaction - Es la transacción que se quiere añadir a las transacciones pendientes.
     */ 
    addTransaction(transaction){
        ///Hacemos varias comprobaciones, primero si las direcciones están rellenas.
        if(!transaction.fromAddress || !transaction.toAddress)
            throw new Error('Transaction must include from and to address');

        //A continuación verificamos si la transacción es válida.
        if(!transaction.isValid())
            throw new Error('No se puede añadir una transacción que no es válida a la cadena');

        this.pendingTransactions.push(transaction);
    }

    /**
     * Recogerá el balance de una dirección en concreto
     * @param {string} address - Es la dirección de la que queremos recoger el balance.
     * @returns Devuelve el balance de la dirección.
     */ 
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address) 
                    balance -= trans.amount;
                if(trans.toAddress == address) 
                    balance += trans.amount;
            }
        }
        return balance;
    }

    /**
     * Devolverá si la blockchain es válida o no.
     * @returns Devuelve si la blockchain es válida.
     */ 
    isValid()
    {
        for(let i = 1; i < this.chain.length; i++){
            let prevBlock = this.chain[i-1];
            let currBlock = this.chain[i];

            ///Comprobamos si todas las transacciones del bloque son correctas.
            if(!currBlock.hasValidTransactions()) return false;

            //Primera comprobación
            if(currBlock.previousHash != prevBlock.hash) return false;

            //Segunda comprobación
            if(currBlock.createHash() != currBlock.hash) return false;
        }

        return true;
    }

}

module.exports.BlockChain = BlockChain;