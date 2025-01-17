/**
 * Defines the configuration for the openid plugin.
 * @category internal
 */
export class PluginConfiguration {

  /**
   * Activates the simulation mode where the login/logout is only simulated. You can define a related simulationUser.
   * @member {boolean}
   */
  simulation;

  /**
   * User object that defines the connected user when simulation mode is enable.
   * @member {Object}
   */
  simulationUser;

  /**
   * Function that defines the profile claim used to represent user identifier.
   * @member {function}
   * @param {Object} profile - the user profile containing claims
   * @return {string} - the value of the claim that represents the user identifier
   */
  userIdClaimSelector;

  /**
   * Function that defines the silent login failure analysis to determine that a complete login is required.
   * @member {function}
   * @param {Object} error - the error object returned by the identity provider on silent login
   * @return {bool} - the condition on this object to trigger the complete login
   */
  loginRequiredSelector;

  /**
   * Function that defines the redirect route name based on the presence of specific profile claims.
   * @member {function}
   */
  redirectsOnClaim;

  /**
   * Function that defines the reconnection prompt that will be displayed when a new connection is required.
   * @member {function}
   */
  reconnectPrompt;

  /**
   * Configuration object of the underlying oidc-client-js library. See https://github.com/IdentityModel/oidc-client-js/wiki for details.
   * @member {Object}
   */
  userManagerSettings;

  /**
   * Callback function called when the oidc provider returns an error.
   * @member {function}
   * @callback
   */
  onError;

}
