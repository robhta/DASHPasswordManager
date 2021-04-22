"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var identityDAO_1 = require("./identityDAO");
var passwordDAO_1 = require("./passwordDAO");
// Identity
exports.createIdentity = identityDAO_1.createIdentity;
exports.topUpIdentity = identityDAO_1.topUpIdentity;
exports.createDpnsName = identityDAO_1.createDpnsName;
exports.findIdentityByName = identityDAO_1.findIdentityByName;
exports.getIdentityBalance = identityDAO_1.getIdentityBalance;
exports.getAllIdentities = identityDAO_1.getAllIdentities;
//Passwords
exports.getAllEntries = passwordDAO_1.getAllEntries;
exports.getEntryByIndex = passwordDAO_1.getEntryByIndex;
exports.createNewEntry = passwordDAO_1.createNewEntry;
exports.deleteEntry = passwordDAO_1.deleteEntry;
//# sourceMappingURL=dapi.js.map