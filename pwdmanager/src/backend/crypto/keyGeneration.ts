import * as Dash from 'dash'

export class KeyGenerator {
    public getHDWalletHardendKey(mnemonicString: string, passphrase: string, index: number): Buffer {
        const mnemonic = new Dash.Core.Mnemonic(mnemonicString);
        const seed = mnemonic.toHDPrivateKey(passphrase);

        const derivedKey = seed.deriveChild(10116, true).deriveChild(0, true).deriveChild(index, true);
        return derivedKey;
    }
}