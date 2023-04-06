import Dash from 'dash';
import { Client } from 'dash/dist/src/SDK/Client';
import { Mnemonic, AddressObj } from '@dashevo/wallet-lib/src/types/types'


export class DashAdapter {
    private dashClient: Client;

    constructor(mnemonic?: string) {
        this.dashClient = new Dash.Client({
            network: 'local',
            wallet: {
                mnemonic: mnemonic ?? null,
                offlineMode: false,
            },
        });
    }

    public async connectToDashNetwork() {
        return await this.dashClient.getDAPIClient().core.getBestBlockHash();
    }

    public async createMnemonic(): Promise<string | undefined> {
        const account = await this.dashClient.getWalletAccount();
        const mnemonic = this.dashClient.wallet?.exportWallet();

        return mnemonic?.toString();
    }

    public async getUnusedAddress(): Promise<AddressObj> {
        const account = await this.dashClient.getWalletAccount();
        return account.getUnusedAddress();
    }

    public getMnemonic(): string | undefined {
        return this.dashClient.wallet?.exportWallet().toString();
    }

    public async createIdentity() {
        return this.dashClient.platform.identities.register();
    }

    public async connectToDash() {
        return await this.dashClient.getDAPIClient().core.getBestBlockHash();
    }

    public async topupIdentity(identity: string) {
        const identityId = identity;
        const topUpAmount = 1000;

        await this.dashClient.platform.identities.topUp(identityId, topUpAmount);
        return this.dashClient.platform.identities.get(identityId);
    }

    public async getAllIdentities(): Promise<string[]> {
        const account = await this.dashClient.getWalletAccount();
        return account.identities.getIdentityIds();
    }

    public async getIdentity(identity: string) {
        return await this.dashClient.platform.identities.get(identity);
    }

    public async setNameForIdentity(identityId: string, name: string) {
        const { platform } = this.dashClient;

        const identity = await platform.identities.get(identityId);
        const nameRegistration = await platform.names.register(
          name + '.dash',
          { dashUniqueIdentityId: identity.getId() },
          identity,
        );
      
        return nameRegistration;
    }

    public async getIdentityByName(name: string) {
        return this.dashClient.platform.names.resolve(name + '.dash');
    }

    public async createPasswordManagerContract(identityId: string) {
        const { platform } = this.dashClient;
        const identity = await platform.identities.get(identityId);
      
        const contractDocuments = {
            passwordmanager: {
              type: 'object',
              indices: [
                {
                    name: 'prop1',
                    properties: [
                        {
                            index: 'asc',
                        },
                        {
                            $ownerId: 'asc'
                        }
                    ],
                    unique: true
                },
                {
                    name: 'prop2',
                    properties: [
                        {
                            $ownerId: 'asc'
                        }
                    ]
                },
              ],
              properties: {
                inputVector: {
                    type: 'array',
                    byteArray: true,
                    minItems: 12,
                    maxItems: 13,
                },
                authenticationTag: {
                    type: 'array',
                    byteArray: true,
                    minItems: 16,
                    maxItems: 16
                },
                payload: {
                    type: 'array',
                    byteArray: true,
                    minItems: 15,
                    maxItems: 150
                },
                index: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 2147483000
                }
              },
              additionalProperties: false,
              required: [
                'index', 
                'inputVector', 
                'authenticationTag', 
                'payload'
              ]
            },
          };
        
        const contract = await platform.contracts.create(contractDocuments, identity);
        console.dir({ contract });
      
        // Make sure contract passes validation checks
        await platform.dpp.initialize();
        const validationResult = await platform.dpp.dataContract.validate(contract);
      
        if (validationResult.isValid()) {
          console.log('Validation passed, broadcasting contract..');
          // Sign and submit the data contract
          return platform.contracts.publish(contract, identity);
        }
        console.error(validationResult);
        throw validationResult.errors[0];
    }
}