const { BlockChain } = require('./blockchain');
const fs = require('fs');
const { Block } = require('./blocks');

class MaterNode{
    /**
     * C.to
     * @param {string} genesis - Es una cadena que utilizamos para generar el bloque.
     * @param {int} difficulty - Es el número de ceros con el comienza el hash del bloque para que sea válido.
     */ 
    constructor(){
        this.pathIPCFile = "./ipc/node.ipc";
        this.BlockChain = new BlockChain();
    }

    /**
     * Comprobará si el fichero IPC está actualmente activo, en ese caso se considera que el 
     * nodo está trabajando.
     * @returns Si el fichero existe.
     */ 
    isRunning(){
        try{
            return fs.existsSync(this.pathIPCFile);
        } catch(err) {
            console.log(err);
        }
        return false;
    }

    getInfo(){
        return {
            running: this.isRunning(),
            id: '99827-11342-90000-86754',
            blocks: this.BlockChain.getLastTransactions(100)
        }
    }

    /**
     * Comenzará el proceso de minado y de comprobaciones de estado de nodos.
     */ 
    start(callback){
        console.log("Loading the blockchain");
        fs.open(this.pathIPCFile, 'w', callback);
    }

    /**
     * Detendrá el proceso de minado y de comprobaciones de estado del nodos.
     */
    stop(callback){
        console.log("stoping the blockchain");
        fs.unlink(this.pathIPCFile, callback);
    }
}

module.exports.MasterNode = MaterNode;