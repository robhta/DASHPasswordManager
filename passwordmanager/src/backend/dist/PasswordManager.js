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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                                    skipSynchronizationBeforeHeight: 415000,
                                },
                            },
                            apps: {
                                passwordManager: {
                                    contractId: '81gBTTGijJu2oh3bj6bby9vgvTDuH8qh6jU2tkGiufRc'
                                },
                            },
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
                        console.log("highest index: ", this.driveIndex);
                        this.driveIndex++;
                        console.log("set index to: ", this.driveIndex);
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
            var passwordsEncrypted, passwordsDecrypted, i, encryptedPassword, payload, masterKey, encKey, decPayload;
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
                            //console.log(decPayload);
                            //console.log();
                            passwordsDecrypted.push(decPayload);
                        }
                        return [2 /*return*/, passwordsDecrypted];
                }
            });
        });
    };
    /**
     * Loads and decrypts all local passwords
     * TODO: improve localIndex generation
     */
    PasswordManager.prototype.getAllLocalPasswords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, entries, _a, _b, _i, index, tmpIndex, encryptedItem, encryptedPayload, masterKey, encKey, decPayload;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("start init the local storage");
                        return [4 /*yield*/, Storage.keys()];
                    case 1:
                        keys = _c.sent();
                        console.log("Number of local passwords: ", keys.keys.length);
                        this.localIndex = keys.keys.length + 1; //Start at an empty index
                        entries = [];
                        _a = [];
                        for (_b in keys.keys)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        index = _a[_i];
                        tmpIndex = parseInt(index) + 1;
                        console.log("Loading index:", tmpIndex);
                        return [4 /*yield*/, Storage.get({ key: tmpIndex.toString() })];
                    case 3:
                        encryptedItem = _c.sent();
                        if (typeof encryptedItem.value === "string") {
                            encryptedPayload = JSON.parse(encryptedItem.value);
                            masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", tmpIndex, 0, Dash);
                            console.log(masterKey);
                            encKey = pwdManager.getKey(masterKey, crypto);
                            console.log(encKey);
                            decPayload = pwdManager.fileLevelDecrytion(encKey, encryptedPayload.payload, Buffer.from(encryptedPayload.authTag), Buffer.from(encryptedPayload.iv), crypto);
                            console.log("decripted Payload");
                            console.log(JSON.parse(decPayload));
                            entries.push(JSON.parse(decPayload));
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, entries];
                }
            });
        });
    };
    /**
     *
     * @param index
     */
    PasswordManager.prototype.deletePasswordFromDrive = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dapi.deleteEntry(this.connection, index)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
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