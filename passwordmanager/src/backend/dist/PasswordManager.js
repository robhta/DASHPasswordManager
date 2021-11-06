"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordManager = void 0;
var dapi = __importStar(require("./drive-persistence/dapi"));
var pwdManager = __importStar(require("./cryptography/pwdManager"));
var keyManager = __importStar(require("./keymanagement/keyderivation"));
var crypto = __importStar(require("crypto"));
var core_1 = require("@capacitor/core");
//import * as Dash from 'dash'
var Dash = require('dash');
var Storage = core_1.Plugins.Storage;
var PasswordManager = /** @class */ (function () {
    function PasswordManager() {
        this.connection = {
            platform: {},
            identity: {}
        };
        this.mnemonic = "";
        this.localIndex = 0;
        this.driveIndex = 0;
        this.client = "";
    }
    /**
     * This method inits the dash variables
     * @param mnemonic
     */
    PasswordManager.prototype.setUpDash = function (mnemonic) {
        return __awaiter(this, void 0, void 0, function () {
            var clientOpts, identity, identities, e_1, size, _a, e_2, _b, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //Storage.clear();
                        console.log("setting up Dash Client");
                        this.mnemonic = mnemonic;
                        clientOpts = {
                            network: 'testnet',
                            wallet: {
                                mnemonic: mnemonic,
                                unsafeOptions: {
                                    skipSynchronizationBeforeHeight: 500000, // only sync from start of 2021
                                },
                            },
                            apps: {
                                passwordManager: {
                                    contractId: '3QEvxGut8XNiKP7TsFH96bprHSBoY37Brm6KtK1PJRPK'
                                },
                            }
                        };
                        this.client = new Dash.Client(clientOpts);
                        console.log("start fetching all identities");
                        this.connection.platform = this.client.platform;
                        identity = null;
                        identities = undefined;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dapi.getAllIdentities(this.client)];
                    case 2:
                        identities = _c.sent();
                        console.log("Identities:");
                        console.log(identities);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        console.log("error while fetching identies", e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        size = "null";
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 15, , 16]);
                        size = identities.length;
                        if (!(parseInt(size) > 0)) return [3 /*break*/, 10];
                        //console.log("Found:");
                        //console.log(identities);
                        identity = identities[0];
                        console.log("Use identity:");
                        console.log(identity);
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        //console.log("Set Identity Object")
                        _a = this.connection;
                        return [4 /*yield*/, this.connection.platform.identities.get(identity)];
                    case 7:
                        //console.log("Set Identity Object")
                        _a.identity = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _c.sent();
                        console.log("Error while get Identity Object", e_2);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 14];
                    case 10:
                        if (!(identities.length == 0)) return [3 /*break*/, 13];
                        console.log("No identities found. Create a new one for you");
                        console.log("try to create a identity");
                        return [4 /*yield*/, dapi.createIdentity(this.client)];
                    case 11:
                        identity = _c.sent();
                        console.log("identity:", identity);
                        //this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
                        _b = this.connection;
                        return [4 /*yield*/, this.connection.platform.identities.get(identity.getId().toString())];
                    case 12:
                        //this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
                        _b.identity = _c.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        console.log("Error while getting all identities");
                        _c.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        e_3 = _c.sent();
                        console.log("error while get length of identites", e_3);
                        return [3 /*break*/, 16];
                    case 16:
                        console.log(this.connection);
                        console.log("Required connection information retrieved");
                        console.log("Init drive index");
                        return [4 /*yield*/, this.initDashPasswordIndex()];
                    case 17:
                        _c.sent();
                        console.log("finished init dash backend");
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordManager.prototype.initLocalPasswordIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Start calculating local storage index");
                        return [4 /*yield*/, Storage.keys()];
                    case 1:
                        keys = _a.sent();
                        for (i = 0; i < keys.keys.length; i++) {
                            if (this.localIndex < keys.keys[i])
                                this.localIndex = parseInt(keys.keys[i]);
                        }
                        console.log("Highest local storage index: ", this.localIndex);
                        this.localIndex++;
                        console.log("Set local storage index to: ", this.localIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordManager.prototype.initDashPasswordIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var passwords, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwords = [];
                        return [4 /*yield*/, this.getAllDashPasswordsEncrypted()];
                    case 1:
                        passwords = _a.sent();
                        for (i = 0; i < passwords.length; i++) {
                            if (passwords[i].data.index > this.driveIndex)
                                this.driveIndex = passwords[i].data.index;
                        }
                        console.log("highest dash index: ", this.driveIndex);
                        this.driveIndex++;
                        console.log("set dash index to: ", this.driveIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordManager.prototype.getAllDashPasswordsEncrypted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var passwords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Fetching all passwords from drive");
                        return [4 /*yield*/, dapi.getAllEntries(this.connection)];
                    case 1:
                        passwords = _a.sent();
                        return [2 /*return*/, passwords];
                }
            });
        });
    };
    PasswordManager.prototype.getAllDashPasswords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var passwordsEncrypted, passwordsDecrypted, i, encryptedPassword, payload, masterKey, encKey, decPayload, decryptedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordsEncrypted = [];
                        return [4 /*yield*/, this.getAllDashPasswordsEncrypted()];
                    case 1:
                        passwordsEncrypted = _a.sent();
                        passwordsDecrypted = [];
                        for (i = 0; i < passwordsEncrypted.length; i++) {
                            console.log("Decrypt password: ", i);
                            encryptedPassword = passwordsEncrypted[i];
                            console.log("Payload: ", encryptedPassword.data.payload.toString());
                            payload = encryptedPassword.data.payload.toString();
                            console.log("Index: ", encryptedPassword.data.index);
                            masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", encryptedPassword.data.index, 1, Dash);
                            encKey = pwdManager.getKey(masterKey, crypto);
                            decPayload = pwdManager.fileLevelDecrytion(encKey, payload, encryptedPassword.data.authenticationTag, encryptedPassword.data.inputVector, crypto);
                            decryptedPassword = JSON.parse(decPayload);
                            decryptedPassword.online = true;
                            decryptedPassword.key = encryptedPassword.data.index;
                            passwordsDecrypted.push(decryptedPassword);
                        }
                        return [2 /*return*/, passwordsDecrypted];
                }
            });
        });
    };
    /**
     * Loads and decrypts all local passwords
     */
    PasswordManager.prototype.getAllLocalPasswords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, entries, i, tmpIndex, encryptedItem, encryptedPayload, masterKey, encKey, decPayload, decryptedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initLocalPasswordIndex()];
                    case 1:
                        _a.sent();
                        console.log("start init the local storage");
                        return [4 /*yield*/, Storage.keys()];
                    case 2:
                        keys = _a.sent();
                        console.log("Number of local passwords: ", keys.keys.length);
                        entries = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < keys.keys.length)) return [3 /*break*/, 6];
                        tmpIndex = parseInt(keys.keys[i]);
                        console.log("Loading index:", tmpIndex);
                        return [4 /*yield*/, Storage.get({ key: tmpIndex.toString() })];
                    case 4:
                        encryptedItem = _a.sent();
                        if (typeof encryptedItem.value === "string") {
                            encryptedPayload = JSON.parse(encryptedItem.value);
                            masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", tmpIndex, 0, Dash);
                            encKey = pwdManager.getKey(masterKey, crypto);
                            decPayload = pwdManager.fileLevelDecrytion(encKey, encryptedPayload.payload, Buffer.from(encryptedPayload.authTag), Buffer.from(encryptedPayload.iv), crypto);
                            decryptedPassword = JSON.parse(decPayload);
                            decryptedPassword.online = false;
                            decryptedPassword.key = tmpIndex;
                            entries.push(decryptedPassword);
                        }
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, entries];
                }
            });
        });
    };
    /**
     *
     * @param entry
     */
    PasswordManager.prototype.deletePassword = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //await dapi.deleteEntry(this.connection, index);
                        console.log("Start deleting: ");
                        console.log(entry);
                        if (!!entry.online) return [3 /*break*/, 2];
                        return [4 /*yield*/, Storage.remove({ key: entry.key })];
                    case 1:
                        _c.sent();
                        console.log("Removed key: ", entry.key);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!entry.online) return [3 /*break*/, 4];
                        _b = (_a = console).log;
                        return [4 /*yield*/, dapi.deleteEntry(this.connection, entry.key)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Encrypt the password and save it to Drive or Localstorage
     * @param entry
     * @param onlineFlag - 0 = Localstorage        1 = Drive
     */
    PasswordManager.prototype.createNewPassword = function (entry, onlineFlag) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKey, symKey, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(this.connection.identity);
                        privateKey = "";
                        if (!onlineFlag) {
                            //console.log("Local PrivKey")
                            privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", this.localIndex, onlineFlag, Dash);
                        }
                        else {
                            //console.log("Drive PrivKey")
                            privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", this.driveIndex, onlineFlag, Dash);
                        }
                        symKey = pwdManager.getKey(privateKey, crypto);
                        payload = pwdManager.fileLevelEncrytion(symKey, JSON.stringify(entry), crypto);
                        if (!onlineFlag)
                            payload.index = this.localIndex; //TODO: care about index and delete ts-ignore
                        else
                            payload.index = this.driveIndex;
                        if (!!onlineFlag) return [3 /*break*/, 2];
                        //Store all new Entrys to Local Storage
                        return [4 /*yield*/, Storage.set({
                                key: payload.index.toString(),
                                value: JSON.stringify({
                                    payload: payload.payload,
                                    iv: payload.iv,
                                    authTag: payload.authTag,
                                })
                            })];
                    case 1:
                        //Store all new Entrys to Local Storage
                        _a.sent();
                        this.localIndex++;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, dapi.createNewEntry(this.connection, payload)];
                    case 3:
                        _a.sent();
                        this.driveIndex++;
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PasswordManager;
}());
exports.PasswordManager = PasswordManager;
exports.default = new PasswordManager();
//# sourceMappingURL=PasswordManager.js.map