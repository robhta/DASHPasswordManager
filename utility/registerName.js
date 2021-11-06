const Dash = require('dash');

const clientOpts = {
    wallet: {
        mnemonic: 'erase window crazy palm royal tornado loud wall shock finish tool knife',
        unsafeOptions: {
            skipSynchronizationBeforeHeight: 500000, // only sync from mid-2021
        },
    },
};
const client = new Dash.Client(clientOpts);

const registerName = async () => {
    const { platform } = client;

    const identity = await platform.identities.get('H4tzQ1rqnYGHsAx4enYDGRuAQdpZABnoZPUGDAVgQAq2');
    const nameRegistration = await platform.names.register(
        'passwordmanager.dash',
        { dashUniqueIdentityId: identity.getId() },
        identity,
    );

    return nameRegistration;
};

registerName()
    .then((d) => console.log('Name registered:\n', d.toJSON()))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());