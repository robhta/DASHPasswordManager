/**
 * Create a new identity
 * @param connection :{
 *     identity: resolved identity by id -- Can be undefined
 *     platform: Dash Platform object
 * }
 * @returns the resolved identity
 */
export declare function createIdentity(connection: any): Promise<any>;
/**
 * Returns a list of all identities to the given connection
 */
export declare function getAllIdentities(client: any): Promise<any>;
/**
 * Top up the given identity in the connection with extra credits
 * @param connection: {WhatsDappConnection}
 * @param topUpAmount {number} in credits
 * @returns check if everything is fine
 */
export declare function topUpIdentity(connection: any, topUpAmount: any): Promise<any>;
/**
 * Register a name at dash platform
 * @param connection: {WhatsDappConnection}
 * @param name: The name for the dpns-name registration (name+.dash)
 * @returns check if everything is fine
 */
export declare function createDpnsName(connection: any, name: any): Promise<any>;
/**
 * Resolve a dpns-name to an identity
 * @param connection: {WhatsDappConnection}
 * @param name: The dpns name (name+.dash)
 * @returns The identity which belongs to the name
 */
export declare function findIdentityByName(connection: any, name: any): Promise<any>;
/**
 * Return the identity balance
 * @param connection {WhatsDappConnection}
 * @returns Credits
 */
export declare function getIdentityBalance(connection: any): Promise<any>;
