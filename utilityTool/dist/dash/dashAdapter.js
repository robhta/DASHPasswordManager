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
        });
    }
    connectToDashNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dashClient.getDAPIClient().core.getBestBlockHash();
        });
    }
    createMnemonic() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.dashClient.getWalletAccount();
            const mnemonic = (_a = this.dashClient.wallet) === null || _a === void 0 ? void 0 : _a.exportWallet();
            return mnemonic === null || mnemonic === void 0 ? void 0 : mnemonic.toString();
        });
    }
    getUnusedAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.dashClient.getWalletAccount();
            return account.getUnusedAddress();
        });
    }
    getMnemonic() {
        var _a;
        return (_a = this.dashClient.wallet) === null || _a === void 0 ? void 0 : _a.exportWallet().toString();
    }
    createIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dashClient.platform.identities.register();
        });
    }
    connectToDash() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dashClient.getDAPIClient().core.getBestBlockHash();
        });
    }
    topupIdentity(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const identityId = identity;
            const topUpAmount = 1000;
            yield this.dashClient.platform.identities.topUp(identityId, topUpAmount);
            return this.dashClient.platform.identities.get(identityId);
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
    setNameForIdentity(identityId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = this.dashClient;
            const identity = yield platform.identities.get(identityId);
            const nameRegistration = yield platform.names.register(name + '.dash', { dashUniqueIdentityId: identity.getId() }, identity);
            return nameRegistration;
        });
    }
    getIdentityByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dashClient.platform.names.resolve(name + '.dash');
        });
    }
    createPasswordManagerContract(identityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = this.dashClient;
            const identity = yield platform.identities.get(identityId);
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
            const contract = yield platform.contracts.create(contractDocuments, identity);
            console.dir({ contract });
            // Make sure contract passes validation checks
            yield platform.dpp.initialize();
            const validationResult = yield platform.dpp.dataContract.validate(contract);
            if (validationResult.isValid()) {
                console.log('Validation passed, broadcasting contract..');
                // Sign and submit the data contract
                return platform.contracts.publish(contract, identity);
            }
            console.error(validationResult);
            throw validationResult.errors[0];
        });
    }
}
exports.DashAdapter = DashAdapter;
