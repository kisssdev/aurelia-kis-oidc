import { RouterConfiguration } from 'aurelia-router';
import { Interceptor } from 'aurelia-fetch-client';
import { UserManagerSettings, User } from 'oidc-client';

export interface PluginConfiguration {
  /**
   * Activates the simulation mode where the login/logout is only simulated. You can define a related simulationUser.
   */
  simulation?: boolean;

  /**
   * User object that defines the connected user when simulation mode is enable.
   */
  simulationUser?: User;

  /**
   * Function that defines the profile claim used to represent user identifier.
   */
  userIdClaimSelector?: (profile: any) => string;

  /**
   * Function that defines the silent login failure analysis to determine that a complete login is required.
   */
  loginRequiredSelector?: (error: any) => boolean;

  /**
   * Function that defines the redirect route name based on the presence of specific profile claims.
   */
  redirectsOnClaim?: (profile: any) => string;

  /**
   * Function that defines the reconnection prompt that will be displayed when a new connection is required.
   * @member {function}
   */
  reconnectPrompt?: (loginFunc: () => void) => void;

  /**
   * Configuration object of the underlying oidc-client-js library. See https://github.com/IdentityModel/oidc-client-js/wiki for details.
   */
  userManagerSettings: UserManagerSettings;
}

export class Connection {
  /**
   * Initiates the OpenID Connect user connection.
   * @param {string} route - the aurelia route name that initiates the user connection
   */
  loginUser(route?: string): Promise<any>;
  /**
   * Initiates the OpenID Connect user deconnection.
   * @param {string} route - the aurelia route name that initiates the user deconnection
   */
  logoutUser(route?: string): Promise<any>;
  /**
   * Initiates the OpenID Connect silent user connection.
   * @param {string} route - the aurelia route name that initiates the silent user connection
   */
  trySilentLogin(route?: string): Promise<any>;

  /**
   * Is silent login in progress?
   */
  inProgress?: boolean;
  /**
   * The user identifier. It may be undefined.
   */
  userId?: string;

  /**
   * Is the user currently connected?
   */
  isUserLoggedIn?: boolean;

  /**
   * Has the user a valid access token?
   */
  hasValidAccessToken?: boolean;

  /**
   * The user access token. The token may be expired. Check hasValidAccessToken property before.
   */
  accessToken?: string;

  /**
   * The display name of the user. The 'name' claim is used to provide this information.
   */
  userName?: string;

  /**
   * The profile of the user. It contains the claims provided by the identity provider.
   */
  profile?: any;

  /**
   * The number of seconds the access token has remaining.
   */
  expiresIn?: number;
}

export class OpenidRouting {
  configureRouter(routerConfiguration: RouterConfiguration);
}

export class Oauth2Interceptor implements Interceptor {}
