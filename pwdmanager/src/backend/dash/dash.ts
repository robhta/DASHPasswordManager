import Dash from 'dash'
import { Client } from 'dash/dist/src/SDK/Client';
import { EncryptedEntity } from '../crypto/encryption';

export class DashAdapter {
    readonly dashClient: Client;
    
    constructor(mnemonic: string) {
        this.dashClient = new Dash.Client({
            network: 'local',
            wallet: {
                mnemonic: mnemonic ?? null,
                offlineMode: false,
            },
            apps: {
                passwordmanager: {
                    contractId: '7h2qW8LKXsU4NdvB8R4ZCpG36qMHpFQfeyPEgH62Q5bA'
                }
            }
        });
    }

    public async getAllIdentities(): Promise<string[]> {
        const account = await this.dashClient.getWalletAccount();
        return account.identities.getIdentityIds();
    }

    public async getIdentity(identity: string) {
        return await this.dashClient.platform.identities.get(identity);
    }

    public async getAllPasswords(identity: string) {
        try {
            const documents = await this.dashClient.platform.documents.get(
                'passwordmanager.passwordmanager',
                {
                    where: [
                        ['$ownerId', "==", identity]
                    ],
                },
            );
            return documents
    
        } catch (e) {
            console.error('Something went wrong:', e);
            return false;
        }
    }

    public async createPassword(entity: EncryptedEntity, identity: string) {
        const doc_properties = {
            index: entity.index,
            inputVector: entity.iv,
            authenticationTag: entity.authTag,
            payload: Buffer.from(entity.payload)
        };

        try {
            const platform = this.dashClient.platform;
            const identityResolved = await this.getIdentity(identity);
            const document = await platform.documents.create(
                'passwordmanager.passwordmanager',
                identityResolved,
                doc_properties,
            );

            const documentBatch = {
                create: [document],
            }

            return await platform.documents.broadcast(documentBatch, identityResolved);
        } catch (e) {
            console.log(e);
        }
    }

    public async deletePassword(index: number, identity: string) {
        const platform = this.dashClient.platform;
        const identityResolved = await this.getIdentity(identity);

        // Retrieve the existing document
        const [document] = await platform.documents.get(
            'passwordmanager.passwordmanager',
            { 
                where: [
                    ['$ownerId', '==', identity],
                    ['index', '==', index]
                ] 
            },
        );

        return await platform.documents.broadcast({
            delete: [document]
        }, identityResolved);
    }

    public async updatePassword(index: number, identity: string, entity: EncryptedEntity) {
        const { platform } = this.dashClient;
        const identityResolved = await this.getIdentity(identity);
      
        // Retrieve the existing document
        const [document] = await this.dashClient.platform.documents.get(
          'passwordmanager.passwordmanager',
          {
            where: [
                ['$ownerId', '==', identity],
                ['index', '==', index]
            ] 
          },
        );
      
        // Update document
        document.set('payload', Buffer.from(entity.payload));
        document.set('inputVector', entity.iv);
        document.set('authenticationTag', entity.authTag);
      
        // Sign and submit the document replace transition
        return platform.documents.broadcast({ replace: [document] }, identityResolved);
    }
}