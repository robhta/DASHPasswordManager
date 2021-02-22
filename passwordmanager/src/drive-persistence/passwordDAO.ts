/**
 * Get all encrypted passwords
 * @param connection
 * @returns {Promise<void>}
 */
export async function getAllEntries(connection: any) : Promise<any>{
    try {
        const documents = await connection.platform.documents.get(
            'passwordManager.passwordmanager',
            {
                where: [
                    ['$ownerId', "==", connection.identity.getId().toString()]
                ],
            },
        );

        return documents

    } catch (e) {
        console.error('Something went wrong:', e);
    }
}

/**
 * Get password to a specific index
 * @param connection
 * @param index
 * @returns {Promise<void>}
 */
export async function getEntryByIndex(connection: any, index: number): Promise<any>{

}

/**
 * Push a new entry to drive
 * @param connection
 * @param entry
 * @returns {Promise<void>}
 */
export async function createNewEntry(connection: any, entry: any): Promise<any>{
    const doc_properties = {
        index: entry.index,
        inputVector: entry.iv,
        authenticationTag: entry.authTag,
        payload: Buffer.from(entry.payload)
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

        console.log("Uploading");
        let result = await connection.platform.documents.broadcast(document_batch, connection.identity)
        console.log("uploaded");
        return result;
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
export async function deleteEntry(connection: any, index: number){

}