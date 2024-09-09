import { Aptos, Account, AptosConfig, Network } from '@aptos-labs/ts-sdk'

const aptos = new Aptos();

let bob = Account.generate();

await aptos.fundAccount({
    accountAddress: bob.accountAddress,
    amount: 100_000,
})

const createCollectionTransaction = await aptos.createCollectionTransaction({
    creator: bob,
    description: 'super description',
    name: 'rato test',
    uri: '',
});

const committedTxn = await aptos.signAndSubmitTransaction({
    signer: bob,
    transaction: createCollectionTransaction,
});

console.log(createCollectionTransaction);
console.log(committedTxn)