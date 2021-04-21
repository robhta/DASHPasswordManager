const Dash = require('dash');

const clientOpts = {
    apps: {
        tutorialContract: {
            contractId: 'AAREKsmfKk9QKX1HPKKnQum7yKuFukxyWpEAuYabVLAs',
        },
    },
};
const client = new Dash.Client(clientOpts);

const getDocuments = async () => {
    return client.platform.documents.get(
        'tutorialContract.passwordmanager',
        {
            limit: 2, // Only retrieve 1 document
        },
    );
};

getDocuments()
    .then((d) => console.log(d))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());