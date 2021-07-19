const assert = require('assert');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Block } = require('../elements/blocks');
const { Transaction } = require('../elements/transactions');

function createBlock()
{
    return new Block([], "texto de prueba");
}

function createBlockConTransacciones()
{
    return new Block([new Transaction("asdfasdf", "qwerwer", 0)], "asdlfkjlasdf");
}


describe('Evaluando la clase bloque', () => {
    it('Calculando el hash del bloque', () => {
        //Si creo dos veces el hash debe de ser igual siempre.
        const block = createBlock();
        const hash1 = block.createHash();
        const hash2 = block.createHash();
        //assert.notEqual(hash, newHash);
        assert.equal(hash1, hash2);
    });

    it('Calculando el hash del bloque al modificar los parámetros', () => {
        //Si creo dos veces el hash debe de ser igual siempre.
        let block = createBlockConTransacciones();
        let hash1 = block.createHash();
        block.transactions = [];
        let hash2 = block.createHash();
        assert.notEqual(hash1, hash2);

        block = createBlockConTransacciones();
        hash1 = block.createHash();
        block.previousHash = "00000";
        hash2 = block.createHash();
        assert.notEqual(hash1, hash2);

        block = createBlockConTransacciones();
        hash1 = block.createHash();
        block.nonce = 9292992;
        hash2 = block.createHash();
        assert.notEqual(hash1, hash2);
    });

    it('Minando el bloque', () => {
        let block = createBlock();
        block.mine(1);
        let hash = block.hash;
        assert.equal(hash.startsWith("0"), true);

        block.mine(3);
        hash = block.hash;
        assert.equal(hash.startsWith("000"), true);
    });
});