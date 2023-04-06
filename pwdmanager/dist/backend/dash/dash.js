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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashAdapter = void 0;
const dash_1 = __importDefault(require("dash"));
class DashAdapter {
    constructor(mnemonic) {
        this.dashClient = new dash_1.default.Client({
            network: 'local',
            wallet: {
                mnemonic: mnemonic !== null && mnemonic !== void 0 ? mnemonic : null,
                offlineMode: false,
            },
            apps: {
                passwordmanager: {
                    contractId: '7h2qW8LKXsU4NdvB8R4ZCpG36qMHpFQfeyPEgH62Q5bA'
                }
            }
        });
    }
    getAllIdentities() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.dashClient.getWalletAccount();
            return account.identities.getIdentityIds();
        });
    }
    getIdentity(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dashClient.platform.identities.get(identity);
        });
    }
    getAllPasswords(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield this.dashClient.platform.documents.get('passwordmanager.passwordmanager', {
                    where: [
                        ['$ownerId', "==", identity]
                    ],
                });
                return documents;
            }
            catch (e) {
                console.error('Something went wrong:', e);
                return false;
            }
        });
    }
    getPasswordByIndex(index, identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const [document] = yield this.dashClient.platform.documents.get('passwordmanager.passwordmanager', { where: [['$ownerId', '==', identity],
                    ['index', '==', index]] });
            return document;
        });
    }
    createPassword(entity, identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc_properties = {
                index: entity.index,
                inputVector: entity.iv,
                authenticationTag: entity.authTag,
                payload: Buffer.from(entity.payload)
            };
            try {
                const platform = this.dashClient.platform;
                const identityResolved = yield this.getIdentity(identity);
                const document = yield platform.documents.create('passwordmanager.passwordmanager', identityResolved, doc_properties);
                const documentBatch = {
                    create: [document],
                };
                return yield platform.documents.broadcast(documentBatch, identityResolved);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    deletePassword(index, identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const platform = this.dashClient.platform;
            const identityResolved = yield this.getIdentity(identity);
            // Retrieve the existing document
            const [document] = yield platform.documents.get('passwordmanager.passwordmanager', {
                where: [
                    ['$ownerId', '==', identity],
                    ['index', '==', index]
                ]
            });
            return yield platform.documents.broadcast({
                delete: [document]
            }, identityResolved);
        });
    }
    updatePassword(index, identity, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = this.dashClient;
            const identityResolved = yield this.getIdentity(identity);
            // Retrieve the existing document
            const [document] = yield this.dashClient.platform.documents.get('passwordmanager.passwordmanager', {
                where: [
                    ['$ownerId', '==', identity],
                    ['index', '==', index]
                ]
            });
            // Update document
            document.set('payload', Buffer.from(entity.payload));
            document.set('inputVector', entity.iv);
            document.set('authenticationTag', entity.authTag);
            // Sign and submit the document replace transition
            return platform.documents.broadcast({ replace: [document] }, identityResolved);
        });
    }
}
exports.DashAdapter = DashAdapter;
