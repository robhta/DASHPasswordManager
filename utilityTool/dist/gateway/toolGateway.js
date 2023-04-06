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
exports.Gateway = void 0;
const dashAdapter_1 = require("../dash/dashAdapter");
class Gateway {
    constructor(mnemonic) {
        this.dashAdapter = new dashAdapter_1.DashAdapter(mnemonic);
    }
    createNewWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Start creating new wallet...');
            console.log('Mnemonic:');
            const mnemonic = yield this.dashAdapter.createMnemonic();
            console.log(mnemonic);
            const address = yield this.dashAdapter.getUnusedAddress();
            console.log('Please fund to:');
            console.log(address.address);
            this.dashAdapter = new dashAdapter_1.DashAdapter(mnemonic);
        });
    }
    getUnusedAdress() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.getUnusedAddress()).address);
        });
    }
    getMnemonic() {
        console.log(this.dashAdapter.getMnemonic());
    }
    connectToPlatform() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Start connection to dash');
            console.log(yield this.dashAdapter.connectToDash());
            console.log('Connected');
        });
    }
    getAllIdentities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dashAdapter.getAllIdentities();
        });
    }
    getIdentity(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.getIdentity(identity)).toJSON());
        });
    }
    createIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.createIdentity()).toJSON());
        });
    }
    topupIdentity(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.topupIdentity(identity)).toJSON());
        });
    }
    setNameForIdentity(identity, name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.setNameForIdentity(identity, name)).toJSON());
        });
    }
    getIdentityByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((yield this.dashAdapter.getIdentityByName(name)).toJSON());
        });
    }
}
exports.Gateway = Gateway;
