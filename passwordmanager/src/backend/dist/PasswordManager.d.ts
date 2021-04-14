export declare class PasswordManager {
    mnemonic: string;
    connection: {
        platform: any;
        identity: Object;
    };
    localIndex: number;
    client: any;
    constructor();
    /**
     * This method inits the dash variables
     * @param mnemonic
     */
    setUpDash(mnemonic: string): Promise<void>;
    getAllDashPasswords(): Promise<any>;
    /**
     * Loads and decrypts all local passwords
     * TODO: improve localIndex generation
     */
    getAllLocalPasswords(): Promise<any[]>;
    /**
     *
     * @param index
     */
    deletePasswordFromDrive(index: number): Promise<void>;
    /**
     * Encrypt the password and save it to Drive or Localstorage
     * @param entry
     * @param onlineFlag - 0 = Localstorage        1 = Drive
     */
    createNewPassword(entry: any, onlineFlag: boolean): Promise<void>;
}
declare const _default: PasswordManager;
export default _default;
