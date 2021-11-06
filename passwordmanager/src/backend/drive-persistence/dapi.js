"use strict";
exports.__esModule = true;
exports.deleteEntry = exports.createNewEntry = exports.getEntryByIndex = exports.getAllEntries = exports.getAllIdentities = exports.getIdentityBalance = exports.findIdentityByName = exports.createDpnsName = exports.topUpIdentity = exports.createIdentity = void 0;
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
