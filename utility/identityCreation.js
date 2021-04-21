const Dash = require('dash');

const clientOpts = {
    network: 'testnet',
    wallet: {
        mnemonic: 'transfer spend faint people art move please sock urban thank enlist obvious',
        unsafeOptions: {
            skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
        },
    },
};
const client = new Dash.Client(clientOpts);

const createIdentity = async () => {
    return client.platform.identities.register();
};

createIdentity()
    .then((d) => console.log('Identity:\n', d.toJSON()))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());