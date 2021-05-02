/**
 * Get all encrypted passwords
 * @param connection
 * @returns {Promise<void>}
 */
export declare function getAllEntries(connection: any): Promise<any>;
/**
 * Get password to a specific index
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
export declare function getEntryByIndex(connection: any, index: number): Promise<any>;
/**
 * Push a new entry to drive
 * @param connection
 * @param entry
 * @returns {Promise<void>}
 */
export declare function createNewEntry(connection: any, entry: any): Promise<any>;
/**
 * delete an entry from drive
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
export declare function deleteEntry(connection: any, index: number): Promise<any>;
