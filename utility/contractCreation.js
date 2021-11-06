const Dash = require('dash');

const clientOpts = {
    wallet: {
        mnemonic: 'erase window crazy palm royal tornado loud wall shock finish tool knife',
        unsafeOptions: {
            skipSynchronizationBeforeHeight: 500000, // only sync from start of 2021
        },
    },
};
const client = new Dash.Client(clientOpts);

const registerContract = async () => {
    const { platform } = client;
    const identity = await platform.identities.get('H4tzQ1rqnYGHsAx4enYDGRuAQdpZABnoZPUGDAVgQAq2');

    const contractDocuments = {
        "passwordmanager": {
            "type": "object",
            "indices": [
                {
                    "properties": [
                        {"index": "asc"},
                        {"$ownerId": "asc"}
                    ],
                    "unique": true
                },
                {
                    "properties": [
                        {"$ownerId": "asc"}
                    ]
                }
            ],
            "properties": {
                "inputVector": {
                    "type": "array",
                    "byteArray": true,
                    "minItems": 12,
                    "maxItems": 12
                },
                "authenticationTag": {
                    "type": "array",
                    "byteArray": true,
                    "minItems": 16,
                    "maxItems": 16
                },
                "payload":{
                    "type": "array",
                    "byteArray": true,
                    "minItems": 15,
                    "maxItems": 150
                },
                "index": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 2147483000
                }
            },
            "additionalProperties": false,
            "required": ["index", "inputVector", "authenticationTag", "payload"]
        }
    }

    const contract = await platform.contracts.create(contractDocuments, identity);
    console.dir({ contract });

    // Make sure contract passes validation checks
    await platform.dpp.initialize();
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