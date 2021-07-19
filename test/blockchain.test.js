const assert = require('assert');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Block } = require('../elements/blocks');
const { Transaction } = require('../elements/transactions');
const { BlockChain } = require('../elements/blockchain');


describe('Evaluando la clase blockchain', () => {
    it('Minamos una transacción', () => {
        const myKey = ec.keyFromPrivate('31821db4cd009f0e2a3f9d2263fd38af782445e017e1d52bc5dd7fca5d909904');
        const myWalletAddress = myKey.getPublic('hex');
        
        let gondorCoin =  new BlockChain('info de genesis');
        const tx1 = new Transaction(myWalletAddress, '0x3386C9F01', 10);
        tx1.signTransaction(myKey);
        gondorCoin.addTransaction(tx1);
        gondorCoin.minePendingTransactions(myWalletAddress);
        assert.equal(gondorCoin.getBalanceOfAddress(myWalletAddress), 90);
    });

    it('Minamos varias transacciones', () => {
        const myKey = ec.keyFromPrivate('31821db4cd009f0e2a3f9d2263fd38af782445e017e1d52bc5dd7fca5d909904');
        const myWalletAddress = myKey.getPublic('hex');

        const myKey2 = ec.keyFromPrivate('e8acff8ee3d1aed081f067160211df5062845cd8ecc4a55cfc5d0d1bc76b3a9e');
        const otherWalletAddress = myKey2.getPublic('hex');

        let gondorCoin =  new BlockChain('info de genesis');
        const tx1 = new Transaction(myWalletAddress, '0x3386C9F01', 10);
        tx1.signTransaction(myKey);

        const tx2 = new Transaction(myWalletAddress, otherWalletAddress, 10);
        tx2.signTransaction(myKey);

        gondorCoin.addTransaction(tx1);
        gondorCoin.addTransaction(tx2);

        gondorCoin.minePendingTransactions(myWalletAddress);

        assert.equal(gondorCoin.getBalanceOfAddress(myWalletAddress), 80);
        assert.equal(gondorCoin.getBalanceOfAddress(otherWalletAddress), 10);
    });

});