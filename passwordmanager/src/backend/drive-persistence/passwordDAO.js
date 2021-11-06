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
exports.__esModule = true;
exports.deleteEntry = exports.createNewEntry = exports.getEntryByIndex = exports.getAllEntries = void 0;
/**
 * Get all encrypted passwords
 * @param connection
 * @returns {Promise<void>}
 */
function getAllEntries(connection) {
    return __awaiter(this, void 0, void 0, function () {
        var documents, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connection.platform.documents.get('passwordManager.passwordmanager', {
                            where: [
                                ['$ownerId', "==", connection.identity.getId().toString()]
                            ]
                        })];
                case 1:
                    documents = _a.sent();
                    return [2 /*return*/, documents];
                case 2:
                    e_1 = _a.sent();
                    console.error('Something went wrong:', e_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllEntries = getAllEntries;
/**
 * Get password to a specific index
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
function getEntryByIndex(connection, index) {
    return __awaiter(this, void 0, void 0, function () {
        var platform, document;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    platform = connection.platform;
                    return [4 /*yield*/, platform.documents.get('passwordManager.passwordmanager', { where: [['$ownerId', '==', connection.identity.getId().toString()],
                                ['index', '==', index]] })];
                case 1:
                    document = (_a.sent())[0];
                    return [2 /*return*/, document];
            }
        });
    });
}
exports.getEntryByIndex = getEntryByIndex;
/**
 * Push a new entry to drive
 * @param connection
 * @param entry
 * @returns {Promise<void>}
 */
function createNewEntry(connection, entry) {
    return __awaiter(this, void 0, void 0, function () {
        var doc_properties, platform, entry_document, documentBatch, result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doc_properties = {
                        index: entry.index,
                        inputVector: entry.iv,
                        authenticationTag: entry.authTag,
                        payload: Buffer.from(entry.payload)
                    };
                    console.log("start creating a new entry on drive");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    platform = connection.platform;
                    return [4 /*yield*/, platform.documents.create('passwordManager.passwordmanager', connection.identity, doc_properties)];
                case 2:
                    entry_document = _a.sent();
                    documentBatch = {
                        create: [entry_document]
                    };
                    return [4 /*yield*/, platform.documents.broadcast(documentBatch, connection.identity)];
                case 3:
                    result = _a.sent();
                    console.log("uploaded");
                    return [2 /*return*/, result];
                case 4:
                    e_2 = _a.sent();
                    console.log(e_2);
                    console.log(e_2.data.errors[0]);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createNewEntry = createNewEntry;
/**
 * delete an entry from drive
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
function deleteEntry(connection, index) {
    return __awaiter(this, void 0, void 0, function () {
        var platform, document;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    platform = connection.platform;
                    return [4 /*yield*/, platform.documents.get('passwordManager.passwordmanager', { where: [['$ownerId', '==', connection.identity.getId().toString()],
                                ['index', '==', index]] })];
                case 1:
                    document = (_a.sent())[0];
                    return [2 /*return*/, platform.documents.broadcast({ "delete": [document] }, connection.identity)];
            }
        });
    });
}
exports.deleteEntry = deleteEntry;
