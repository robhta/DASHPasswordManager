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
const toolGateway_1 = require("./gateway/toolGateway");
const topOptions = [
    { value: 'init', title: 'Create new wallet' },
    { value: 'existing', title: 'Use existing wallet' },
];
const lowOptions = [
    { value: 'connect', title: 'Connect to devnet' },
    { value: 'getAllIdentities', title: 'Get all identites of account' },
    { value: 'createIdentity', title: 'Create identity' },
    { value: 'topup', title: 'Topup identity' },
    { value: 'registerName', title: 'Register name for identity' },
    { value: 'address', title: 'Get unused address' },
    { value: 'mnemonic', title: 'Show mnemonic' },
    { value: 'fund', title: 'Show fund' },
    { value: 'name', title: 'Get identity of name' },
    { value: 'identity', title: 'Get identity' }
];
function getOneIdentity(gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        const identites = yield gateway.getAllIdentities();
        const response = yield (0, prompts_1.default)({
            type: 'select',
            name: 'identity',
            message: 'Choose identity',
            choices: identites.map(identity => ({ title: identity, value: identity }))
        });
        return response.identity;
    });
}
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, prompts_1.default)({
        type: 'select',
        name: 'option',
        message: 'What do you want:',
        choices: topOptions
    });
    let gateway;
    switch (response.option) {
        // When user has no mnemonic, or want to create a new wallet
        // Gateway will be initilized with new mnemonic
        case 'init':
            gateway = new toolGateway_1.Gateway();
            yield gateway.createNewWallet();
            break;
        // When user has mnemonic, he has to enter the mnemonic first
        // Gateway will be initilized with mnemonic
        default:
            const mnemonic = yield enterString('Enter mnemonic');
            gateway = new toolGateway_1.Gateway(mnemonic);
            break;
    }
    let continueProgram = true;
    while (continueProgram) {
        const lowResponse = yield (0, prompts_1.default)({
            type: 'select',
            name: 'option',
            message: 'What do you want:',
            choices: lowOptions
        });
        switch (lowResponse.option) {
            case 'address':
                yield gateway.getUnusedAdress();
                break;
            case 'mnemonic':
                gateway.getMnemonic();
                break;
            case 'fund':
                break;
            case 'registerName':
                const identityName = yield getOneIdentity(gateway);
                const name = yield enterString('Enter name for identity');
                yield gateway.setNameForIdentity(identityName, name);
                break;
            case 'topup':
                const identityTopup = yield getOneIdentity(gateway);
                yield gateway.topupIdentity(identityTopup);
                break;
            case 'createIdentity':
                yield gateway.createIdentity();
                break;
            case 'getAllIdentities':
                yield gateway.getAllIdentities();
                break;
            case 'connect':
                yield gateway.connectToPlatform();
                break;
            case 'identity':
                const identity = yield getOneIdentity(gateway);
                yield gateway.getIdentity(identity);
                break;
            case 'name':
                const identityByName = yield enterString('Enter name of identity');
                yield gateway.getIdentityByName(identityByName);
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
