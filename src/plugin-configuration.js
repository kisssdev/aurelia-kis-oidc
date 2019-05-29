/**
 * Defines the configuration for the openid plugin.
 * @category internal
 */
export class PluginConfiguration {

  /**
   * Function that defines the profile claim used to represent user identifier.
   * @param {Object} profile - the user profile containing claims
   * @return {string} the value of the claim that represents the user identifier
   */
  userIdClaimSelector;

  /**
   * Function that defines the redirect route name based on the presence of specific profile claims.
   * @param {Object} profile - the user profile containing claims
   * @return {string} the route name or undefined
   */
  redirectsOnClaim;

  /**
   * Function that defines the reconnection prompt that will be displayed when a new connection is required.
   * @param {function} yesFunc - the callback function when the user confirms the reconnection prompt
   */
  reconnectPrompt;

  /**
   * Configuration object of the underlying oidc-client-js library.
   * See https://github.com/IdentityModel/oidc-client-js/wiki for details.
   */
  userManagerSettings;

}
