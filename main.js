const {BlockChain} = require('./elements/blockchain');
const {Transaction} = require('./elements/transactions');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('31821db4cd009f0e2a3f9d2263fd38af782445e017e1d52bc5dd7fca5d909904');
const myWalletAddress = myKey.getPublic('hex');


let gondorCoin =  new BlockChain('info de genesis');

///En esta transacción ponemos que vaya desde mi dirección, hasta una public key definida. Solo hay un
///wallet de mometo, así que podemos definir cualquiera. Defino: 0x3386C9F01
const tx1 = new Transaction(myWalletAddress, '0x3386C9F01', 10);
tx1.signTransaction(myKey);
gondorCoin.addTransaction(tx1);

console.log("\n Starting the miner...");

///Si ponemos el minero en 0x0986AABB nunca se podría acceder hasta este dinero, porque no tiene privatekey
///Así pues, lo ponemos en la dirección de mywallet
//gondorCoin.minePendingTransactions("0x0986AABB");
gondorCoin.minePendingTransactions(myWalletAddress);
console.log('\n Balance of miner is', gondorCoin.getBalanceOfAddress(myWalletAddress));
gondorCoin.minePendingTransactions(myWalletAddress);
console.log('\n Balance of miner is', gondorCoin.getBalanceOfAddress(myWalletAddress));
gondorCoin.minePendingTransactions(myWalletAddress);
console.log('\n Balance of miner is', gondorCoin.getBalanceOfAddress(myWalletAddress));
gondorCoin.minePendingTransactions(myWalletAddress);
const tx2 = new Transaction(myWalletAddress, '0x3386C9F01', 80);
tx2.signTransaction(myKey);
gondorCoin.addTransaction(tx2);
console.log('\n Balance of miner is', gondorCoin.getBalanceOfAddress(myWalletAddress));
gondorCoin.minePendingTransactions(myWalletAddress);
console.log('\n Balance of miner is', gondorCoin.getBalanceOfAddress(myWalletAddress));

console.log("¿Es válida la cadena?", gondorCoin.isValid());

///Vamos a romper la cadena y comprobamos si es válida.
gondorCoin.chain[1].transactions[0].amount = 1;
console.log("¿Es válida la cadena?", gondorCoin.isValid());
