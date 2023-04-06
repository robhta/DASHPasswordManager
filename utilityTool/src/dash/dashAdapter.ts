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
}