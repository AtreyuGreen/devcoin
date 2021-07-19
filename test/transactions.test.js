const assert = require('assert');

const {BlockChain} = require('../elements/blockchain');
const {Transaction} = require('../elements/transactions');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function createTransaction()
{
    const myKey = ec.keyFromPrivate('31821db4cd009f0e2a3f9d2263fd38af782445e017e1d52bc5dd7fca5d909904');
    const myWalletAddress = myKey.getPublic('hex');
    return new Transaction(myWalletAddress, '0x3386C9F01', 10);
}

function createWallet()
{
    const myKey = ec.keyFromPrivate('31821db4cd009f0e2a3f9d2263fd38af782445e017e1d52bc5dd7fca5d909904');
    return [myKey.getPublic('hex'), myKey];
}

function createOtherWallet()
{
    const myKey = ec.keyFromPrivate('e8acff8ee3d1aed081f067160211df5062845cd8ecc4a55cfc5d0d1bc76b3a9e');
    return [myKey.getPublic('hex'), myKey];
}

describe('Evaluando la clase transacción', () => {
    it('Calculando el hash de la transacción', () => {
        const tx = createTransaction();
        const hash = tx.calculateHash();
        tx.amount = 30000;
        const newHash = tx.calculateHash();
        assert.notEqual(hash, newHash);
        //assert.equal(hash, newHash);
    });

    it('Comprobar si el bloque es válido', () => {
        const wallets = createWallet();
        const otherWallets = createOtherWallet();

        const wallet = wallets[0];
        const key = wallets[1];

        const otherWallet = otherWallets[0];
        const otherkey = otherWallets[1];

        const tx = createTransaction();
        tx.fromAddress = null;
        assert.equal(tx.isValid(), true);

    });

    it('Comprobar si el bloque se ha firmado', () => {
        const wallets = createWallet();
        const otherWallets = createOtherWallet();

        const wallet = wallets[0];
        const key = wallets[1];

        const otherWallet = otherWallets[0];
        const otherkey = otherWallets[1];

        const tx1 = createTransaction(); ///Sin firmar
        try{
            tx1.isValid();
        }catch(err){
            assert.equal(err.message, "No hay firma para esta transacción");
        }        
    });

    it('Comprobar si el bloque válidos', () => {
        const wallets = createWallet();
        const otherWallets = createOtherWallet();

        const wallet = wallets[0];
        const key = wallets[1];

        const otherWallet = otherWallets[0];
        const otherkey = otherWallets[1];

        const tx2 = new Transaction(wallet, '0x3386C9F01', 10);
        tx2.signTransaction(key);
        assert.equal(tx2.isValid(), true);

        const tx3 = new Transaction(otherWallet, '0x3386C9F01', 10);
        tx3.signTransaction(otherkey);
        assert.equal(tx3.isValid(), true);

    });

    it('Comprobar si bloque válido si se cambia la dirección from', () => {
        const wallets = createWallet();
        const otherWallets = createOtherWallet();

        const wallet = wallets[0];
        const key = wallets[1];

        const otherWallet = otherWallets[0];
        const otherkey = otherWallets[1];

        const tx2 = new Transaction(wallet, '0x3386C9F01', 10);
        tx2.signTransaction(key);
        assert.equal(tx2.isValid(), true);
        tx2.fromAddress = otherWallet;
        assert.equal(tx2.isValid(), false);

    });


});