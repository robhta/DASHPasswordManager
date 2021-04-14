/* eslint-disable */
import {
    createIdentity as _createIdentity,
    topUpIdentity as _topUpIdentity,
    getIdentityBalance as _getIdentityBalance,
    createDpnsName as _createDpnsName,
    findIdentityByName as _findIdentityByName,
    getAllIdentities as _getAllIdentities
} from "./identityDAO";

import {
    getAllEntries as _getAllEntries,
    getEntryByIndex as _getEntryByIndex,
    createNewEntry as _createNewEntry,
    deleteEntry as _deleteEntry
} from "./passwordDAO"



// Identity
export const createIdentity = _createIdentity;
export const topUpIdentity = _topUpIdentity;
export const createDpnsName = _createDpnsName;
export const findIdentityByName = _findIdentityByName;
export const getIdentityBalance = _getIdentityBalance;
export const getAllIdentities = _getAllIdentities;


//Passwords
export const getAllEntries = _getAllEntries;
export const getEntryByIndex = _getEntryByIndex;
export const createNewEntry = _createNewEntry;
export const deleteEntry = _deleteEntry;