import { Encryption } from "./crypto/encryption";
import { KeyGenerator } from "./crypto/keyGeneration";
import { DashAdapter } from "./dash/dash";

export type PasswordEntry = {
    name: string;
    password: string;
    key: number;
}

export class PasswordManager {
    readonly mnemonic: string;
    readonly dashAdapter: DashAdapter;
    readonly keyGenerator: KeyGenerator;
    readonly encryption: Encryption;

    dashIdentity: string = '';
    nextIndex: number = 0;

    decryptedPasswords: PasswordEntry[] = [];


    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
        this.dashAdapter = new DashAdapter(mnemonic);
        this.keyGenerator = new KeyGenerator();
        this.encryption = new Encryption();
    }

    public async getAllDashIdentities() {
        return await this.dashAdapter.getAllIdentities();
    }

    public setDashIdentity(identity: string) {
        this.dashIdentity = identity;
    }

    public async init() {
        this.decryptedPasswords = await this.getAllDashPasswords();
        this.setNextIndex();
    }

    private setNextIndex() {
        for(let i = 0; i < this.decryptedPasswords.length; i++){
            if(this.decryptedPasswords[i].key > this.nextIndex)
                this.nextIndex = this.decryptedPasswords[i].key;
        }
        this.nextIndex++;
    }

    private async getAllDashPasswords(): Promise<PasswordEntry[]> {
        const passwordsEncrypted = await this.dashAdapter.getAllPasswords(this.dashIdentity);
        const passwordsDecrypted = [];

        for(const encryptedPassword of passwordsEncrypted) {
            const payloadEncrypted = encryptedPassword.data.payload.toString();
            const index = encryptedPassword.data.index;

            const masterKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, '', index);
            const decryptionKey = this.encryption.getKey(masterKey);

            const payloadDecrypted = this.encryption.fileLevelDecryption(
                decryptionKey,
                payloadEncrypted,
                encryptedPassword.data.authenticationTag,
                encryptedPassword.data.inputVector,
            );

            const decryptedPassword: PasswordEntry = JSON.parse(payloadDecrypted);
            decryptedPassword.key = index;
            passwordsDecrypted.push(decryptedPassword);
        }
        return passwordsDecrypted;
    }

    public async createNewPassword(entry: PasswordEntry) {
        const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", this.nextIndex);
        const encryptionKey = this.encryption.getKey(privateKey);

        const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
        payloadEncrypted.index = this.nextIndex;

        await this.dashAdapter.createPassword(payloadEncrypted, this.dashIdentity);
        entry.key = this.nextIndex;
        this.decryptedPasswords.push(entry);

        this.nextIndex++;
    }

    public test(entry: PasswordEntry) {
        console.log(JSON.stringify(entry));

        const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", 100);
        const encryptionKey = this.encryption.getKey(privateKey);

        const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
        payloadEncrypted.index = 100;

        console.log(JSON.stringify(payloadEncrypted));
            
        const masterKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, '', 100);
        const decryptionKey = this.encryption.getKey(masterKey);

        const payloadDecrypted = this.encryption.fileLevelDecryption(
            decryptionKey,
            payloadEncrypted.payload,
            payloadEncrypted.authTag,
            payloadEncrypted.iv,
        );

        const decryptedPassword: PasswordEntry = JSON.parse(payloadDecrypted);
        decryptedPassword.key = 100;
        
        console.log(JSON.stringify(payloadDecrypted));
    }

    public getPasswordEntries(): PasswordEntry[] {
        return this.decryptedPasswords;
    }

    public async deletePasswordEntry(entry: PasswordEntry) {
        await this.dashAdapter.deletePassword(entry.key, this.dashIdentity);
        this.decryptedPasswords = this.decryptedPasswords.filter(password => {
            return password.key !== entry.key;
        });
    }

    public async updatePasswordEntry(entry: PasswordEntry) {
        const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", entry.key);
        const encryptionKey = this.encryption.getKey(privateKey);

        const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
        payloadEncrypted.index = entry.key;

        await this.dashAdapter.updatePassword(entry.key, this.dashIdentity, payloadEncrypted);

        this.decryptedPasswords = this.decryptedPasswords.filter(password => {
            return password.key !== entry.key;
        });

        this.decryptedPasswords.push(entry);
    }
}