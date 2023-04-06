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
const prompts_1 = __importDefault(require("prompts"));
const passwordmanager_1 = require("../backend/passwordmanager");
const pwdOptions = [
    { value: 'entries', title: 'Show entries' },
    { value: 'creation', title: 'Create password' },
    { value: 'update', title: 'Update password' },
    { value: 'deletion', title: 'Delete password' },
    { value: 'testEncryption', title: 'Test encryption' }
];
function enterString(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, prompts_1.default)({
            type: 'text',
            name: 'value',
            message,
        });
        return response.value;
    });
}
function getOneIdentity(manager) {
    return __awaiter(this, void 0, void 0, function* () {
        const identites = yield manager.getAllDashIdentities();
        const response = yield (0, prompts_1.default)({
            type: 'select',
            name: 'identity',
            message: 'Choose identity',
            choices: identites.map(identity => ({ title: identity, value: identity }))
        });
        return response.identity;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mnemonic = yield enterString('Enter mnemonic to login');
    const manager = new passwordmanager_1.PasswordManager(mnemonic);
    const identity = yield getOneIdentity(manager);
    manager.setDashIdentity(identity);
    // await manager.init();
    let continueProgram = true;
    while (continueProgram) {
        const pwdResponse = yield (0, prompts_1.default)({
            type: 'select',
            name: 'pwdOption',
            choices: pwdOptions,
            message: 'What do you want to do',
        });
        switch (pwdResponse.pwdOption) {
            case 'entries':
                break;
            case 'creation':
                break;
            case 'update':
                break;
            case 'deletion':
                break;
            case 'testEncryption':
                const name = yield enterString('Enter name for password');
                const password = yield enterString('Enter password');
                const passwordEntry = {
                    key: 100,
                    name,
                    password
                };
                manager.test(passwordEntry);
                break;
        }
        const continueResponse = yield (0, prompts_1.default)({
            type: 'confirm',
            name: 'continue',
            message: 'Do want to go ahead?'
        });
        continueProgram = continueResponse.continue;
    }
}))();
