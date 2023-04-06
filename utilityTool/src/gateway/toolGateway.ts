import { DashAdapter } from "../dash/dashAdapter";

export class Gateway {
    private dashAdapter: DashAdapter;

    constructor(mnemonic?: string) {
        this.dashAdapter = new DashAdapter(mnemonic);
    }

    public async createNewWallet() {
        console.log('Start creating new wallet...');
        console.log('Mnemonic:');
        const mnemonic = await this.dashAdapter.createMnemonic();
        console.log(mnemonic);
        const address = await this.dashAdapter.getUnusedAddress();
        console.log('Please fund to:');
        console.log(address.address);

        this.dashAdapter = new DashAdapter(mnemonic);
    }

    public async getUnusedAdress() {
        console.log((await this.dashAdapter.getUnusedAddress()).address);
    }

    public getMnemonic() {
        console.log(this.dashAdapter.getMnemonic());
    }

    public async connectToPlatform() {
        console.log('Start connection to dash');
        console.log(await this.dashAdapter.connectToDash());
        console.log('Connected');
    }

    public async getAllIdentities(): Promise<string[]> {
        return await this.dashAdapter.getAllIdentities();
    }

    public async getIdentity(identity: string) {
        console.log((await this.dashAdapter.getIdentity(identity)).toJSON());
    }

    public async createIdentity() {
        console.log((await this.dashAdapter.createIdentity()).toJSON());
    }

    public async topupIdentity(identity: string) {
        console.log((await this.dashAdapter.topupIdentity(identity)).toJSON())
    }

    public async setNameForIdentity(identity: string, name: string) {
        console.log((await this.dashAdapter.setNameForIdentity(identity, name)).toJSON());
    }

    public async getIdentityByName(name: string) {
        console.log((await this.dashAdapter.getIdentityByName(name)).toJSON());
    }

    public async createPwdManagerContract(identity: string) {
        console.log((await this.dashAdapter.createPasswordManagerContract(identity)).toJSON());
    }
}