/**
 * Get all encrypted passwords
 * @param connection
 * @returns {Promise<void>}
 */
export async function getAllEntries(connection){

}

/**
 * Get password to a specific index
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
export async function getEntryByIndex(connection, index){

}

/**
 * Push a new entry to drive
 * @param connection
 * @param entry
 * @returns {Promise<void>}
 */
export async function createNewEntry(connection, entry){
    const doc_properties = {
        index: entry.index,
        inputVector: entry.inputVector,
        authenticationTag: entry.authenticationTag,
        payload: entry.payload
    };

    console.log("Start creating a new entry on drive");
    try {
        const entry_document = await connection.platform.documents.create(
            'passwordManager.passwordmanager',
            connection.identity,
            doc_properties,
        );
        console.log("Document locally created");
        console.log(entry_document);

        const document_batch = {
            create: [entry_document],
        };

        console.log("Uploading (Async). Returning to Main");
        return connection.platform.documents.broadcast(document_batch, connection.identity);
    } catch (e) {
        console.log(e);
    }
}

/**
 * delete an entry from drive
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
export async function deleteEntry(connection, index){

}