import { inject, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserManager, Log } from 'oidc-client';
import { getCurrentRouteInfo } from './constants';
import { UserPrompt } from './user-prompt';
import { PluginConfiguration } from './plugin-configuration';
import { defaultUserIdClaimSelector } from './constants';

/**
 * Provides an encapsulation of the OpenID Connect user connection.
 */
@inject(Router, PluginConfiguration, UserManager, UserPrompt)
export class Connection {

  /**
   * Creates an instance of the class with the given parameter.
   * @param {Router} router - the aurelia router
   * @param {PluginConfiguration} configuration - the openid plugin configuration
   * @param {UserManager} userManager - the openid user manager
   * @param {UserPrompt} userPrompt - the user prompt to confirm reconnection
   */
  constructor(router, configuration, userManager, userPrompt) {
    this.user = null;
    this._router = router;
    this._userManager = userManager;
    this.observeUser(user => this._setUser(user));
    this._reconnectPrompt = userPrompt.reconnectPrompt;
    this._userIdClaimSelector = configuration.userIdClaimSelector || defaultUserIdClaimSelector;
  }

  /**
   * Defines a callback called when user connection changes.
   * @param {function} userfunc - a callback called when user connection changes
   * @return {Promise} the promise that
   */
  observeUser(userfunc) {
    this._userManager.events.addUserLoaded(user => userfunc(user));
    this._userManager.events.addUserUnloaded(user => userfunc(user));
    return this._userManager.getUser().then(user => userfunc(user));
  }

  /**
   * Initiates the OpenID Connect user connection.
   * @param {string} route - the aurelia route name that initiates the user connection
   */
  async loginUser(route) {
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      Log.info(`Connection.loginUser: starting signin redirection with ${redirectRoute}...`);
      await this._userManager.signinRedirect({ state: redirectRoute });
    } catch (error) {
      Log.error('Connection.loginUser: unable to login', error);
      throw error;
    }
  }

  /**
   * Initiates the OpenID Connect user deconnection.
   * @param {string} route - the aurelia route name that initiates the user deconnection
   */
  async logoutUser(route) {
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      Log.info(`Connection.logoutUser: starting signout redirection with ${redirectRoute}...`);
      await this._userManager.signoutRedirect({ state: redirectRoute });
    } catch (error) {
      Log.error('Connection.logoutUser: unable to logout', error);
      throw error;
    }
  }

  /**
   * Initiates the OpenID Connect silent user connection.
   * @param {string} route - the aurelia route name that initiates the silent user connection
   */
  async trySilentLogin(route) {
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      Log.info(`Connection.trySilentLogin: starting silent signin redirection with ${redirectRoute}...`);
      await this._userManager.signinSilent({ state: redirectRoute });
    } catch (error) {
      Log.warn(`Connection.trySilentLogin: silent signin error: ${error}`);
      if (error.error === 'interaction_required') {
        this._reconnectPrompt(() => this.loginUser(redirectRoute));
      } else {
        Log.error('Connection.trySilentLogin: unable to login silently', error);
        throw error;
      }
    }
  }

  /**
   * Sets the connected user entity.
   * @param {User} user - the OpenID Connect user
   */
  _setUser(user) {
    this.user = user;
  }

  /**
   * The user identifier. It may be undefined.
   * @type {string}
   */
  @computedFrom('user')
  get userId() {
    return this.user?.profile ? this._userIdClaimSelector(this.user.profile) : '';
  }

  /**
   * Is the user currently connected?
   * @type {boolean}
   */
  @computedFrom('user')
  get isUserLoggedIn() {
    return this.user !== null;
  }

  /**
   * Has the user a valid access token?
   * @type {boolean}
   */
  @computedFrom('user')
  get hasValidAccessToken() {
    return (this.user !== null && this.user.expired === false && !!this.user.access_token );
  }

  /**
   * The user access token. The token may be expired. Check hasValidAccessToken property before.
   * @type {string}
   */
  @computedFrom('user')
  get accessToken() {
    // eslint-disable-next-line camelcase
    return this.user?.access_token;
  }

  /**
   * The display name of the user. The 'name' claim is used to provide this information.
   * @type {string}
   */
  @computedFrom('user')
  get userName() {
    return this.user?.profile?.name;
  }

}
