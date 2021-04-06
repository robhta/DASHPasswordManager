const Dash = require('dash');

const clientOpts = {
    wallet: {
        mnemonic: 'a Dash wallet mnemonic with funds goes here',
        unsafeOptions: {
            skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
        },
    },
};
const client = new Dash.Client(clientOpts);

const registerContract = async () => {
    const { platform } = client;
    const identity = await platform.identities.get('an identity ID goes here');

    const contractDocuments = {
        note: {
            properties: {
                message: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
    };

    const contract = await platform.contracts.create(contractDocuments, identity);
    console.dir({ contract });

    // Make sure contract passes validation checks
    const validationResult = await platform.dpp.dataContract.validate(contract);

    if (validationResult.isValid()) {
        console.log('Validation passed, broadcasting contract..');
        // Sign and submit the data contract
        return platform.contracts.broadcast(contract, identity);
    }
    console.error(validationResult); // An array of detailed validation errors
    throw validationResult.errors[0];
};

registerContract()
    .then((d) => console.log('Contract registered:\n', d.toJSON()))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());