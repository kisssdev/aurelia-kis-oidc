/**
 * Defines the configuration for the openid plugin.
 * @category internal
 */
export class PluginConfiguration {

  /**
   * Activates the simulation where the login/logout is only simulated. You can define a related simulationUser.
   * @member {boolean}
   */
  simulation;

  /**
   * User object that defines the connected user when simulation is enable.
   * @member {Object}
   */
  simulationUser;

  /**
   * Function that defines the profile claim used to represent user identifier.
   * @member {function}
   */
  userIdClaimSelector;

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

}
