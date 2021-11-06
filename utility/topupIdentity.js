const Dash = require('dash');

const clientOpts = {
    network: 'testnet',
    wallet: {
        mnemonic: 'erase window crazy palm royal tornado loud wall shock finish tool knife',
        unsafeOptions: {
            skipSynchronizationBeforeHeight: 500000, // only sync from mid-2021
        },
    },
};
const client = new Dash.Client(clientOpts);

const topupIdentity = async () => {
    const identityId = 'H4tzQ1rqnYGHsAx4enYDGRuAQdpZABnoZPUGDAVgQAq2';
    const topUpAmount = 1000; // Number of duffs

    await client.platform.identities.topUp(identityId, topUpAmount);
    return client.platform.identities.get(identityId);
};

topupIdentity()
    .then((d) => console.log('Identity credit balance: ', d.balance))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());