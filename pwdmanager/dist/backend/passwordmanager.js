"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordManager = void 0;
const encryption_1 = require("./crypto/encryption");
const keyGeneration_1 = require("./crypto/keyGeneration");
const dash_1 = require("./dash/dash");
class PasswordManager {
    constructor(mnemonic) {
        this.dashIdentity = '';
        this.nextIndex = 0;
        this.decryptedPasswords = [];
        this.mnemonic = mnemonic;
        this.dashAdapter = new dash_1.DashAdapter(mnemonic);
        this.keyGenerator = new keyGeneration_1.KeyGenerator();
        this.encryption = new encryption_1.Encryption();
    }
    getAllDashIdentities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dashAdapter.getAllIdentities();
        });
    }
    setDashIdentity(identity) {
        this.dashIdentity = identity;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.decryptedPasswords = yield this.getAllDashPasswords();
            this.setNextIndex();
        });
    }
    setNextIndex() {
        for (let i = 0; i < this.decryptedPasswords.length; i++) {
            if (this.decryptedPasswords[i].key > this.nextIndex)
                this.nextIndex = this.decryptedPasswords[i].key;
        }
        this.nextIndex++;
    }
    getAllDashPasswords() {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordsEncrypted = yield this.dashAdapter.getAllPasswords(this.dashIdentity);
            const passwordsDecrypted = [];
            for (const encryptedPassword of passwordsEncrypted) {
                const payloadEncrypted = encryptedPassword.data.payload.toString();
                const index = encryptedPassword.data.index;
                const masterKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, '', index);
                const decryptionKey = this.encryption.getKey(masterKey);
                const payloadDecrypted = this.encryption.fileLevelDecryption(decryptionKey, payloadEncrypted, encryptedPassword.data.authenticationTag, encryptedPassword.data.inputVector);
                const decryptedPassword = JSON.parse(payloadDecrypted);
                decryptedPassword.key = index;
                passwordsDecrypted.push(decryptedPassword);
            }
            return passwordsDecrypted;
        });
    }
    createNewPassword(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", this.nextIndex);
            const encryptionKey = this.encryption.getKey(privateKey);
            const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
            payloadEncrypted.index = this.nextIndex;
            yield this.dashAdapter.createPassword(payloadEncrypted, this.dashIdentity);
            entry.key = this.nextIndex;
            this.decryptedPasswords.push(entry);
            this.nextIndex++;
        });
    }
    test(entry) {
        console.log(JSON.stringify(entry));
        const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", 100);
        const encryptionKey = this.encryption.getKey(privateKey);
        const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
        payloadEncrypted.index = 100;
        console.log(JSON.stringify(payloadEncrypted));
        const masterKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, '', 100);
        const decryptionKey = this.encryption.getKey(masterKey);
        const payloadDecrypted = this.encryption.fileLevelDecryption(decryptionKey, payloadEncrypted.payload, payloadEncrypted.authTag, payloadEncrypted.iv);
        const decryptedPassword = JSON.parse(payloadDecrypted);
        decryptedPassword.key = 100;
        console.log(JSON.stringify(payloadDecrypted));
    }
    getPasswordEntries() {
        return this.decryptedPasswords;
    }
    deletePasswordEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dashAdapter.deletePassword(entry.key, this.dashIdentity);
            this.decryptedPasswords = this.decryptedPasswords.filter(password => {
                return password.key !== entry.key;
            });
        });
    }
    updatePasswordEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKey = this.keyGenerator.getHDWalletHardendKey(this.mnemonic, "", entry.key);
            const encryptionKey = this.encryption.getKey(privateKey);
            const payloadEncrypted = this.encryption.fileLevelEncryption(encryptionKey, JSON.stringify(entry));
            payloadEncrypted.index = entry.key;
            yield this.dashAdapter.updatePassword(entry.key, this.dashIdentity, payloadEncrypted);
            this.decryptedPasswords = this.decryptedPasswords.filter(password => {
                return password.key !== entry.key;
            });
            this.decryptedPasswords.push(entry);
        });
    }
}
exports.PasswordManager = PasswordManager;
