import { inject } from 'aurelia-framework';
import { UserManager, Log } from 'oidc-client';
import { ROUTES } from './constants';
import { PluginConfiguration } from './plugin-configuration';
import { OpenidSilentLoginDetector } from './openid-silent-login-detector';

/**
 * Extends the aurelia application router to support the OpenID Connect redirections.
 */
@inject(PluginConfiguration, UserManager, OpenidSilentLoginDetector)
export class OpenidRouting {

  /**
   * Creates an instance of the class with the given parameter.
   * @param {PluginConfiguration} configuration - the openid plugin configuration
   * @param {UserManager} userManager - the openid user manager
   * @param {OpenidSilentLoginDetector} detector - the silent login detector
   */
  constructor(configuration, userManager, detector) {
    this._configuration = configuration;
    this._userManager = userManager;
    this._detector = detector;
  }

  /**
   * Configures the aurelia router with the specific OpenID Connect login/logout routes.
   * @param {RouterConfiguration} routerConfiguration - the aurelia router configuration
   */
  configureRouter(routerConfiguration) {
    routerConfiguration.mapRoute({
      name: ROUTES.signinRedirectCallback.name,
      navigationStrategy: instruction => {
        if (this._detector.isSilentLogin()) {
          return this.silentSignInStrategy(instruction);
        }
        return this.signInStrategy(instruction);
      },
      route: this.getPath(ROUTES.signinRedirectCallback.url)
    });

    routerConfiguration.mapRoute({
      name: ROUTES.signoutRedirectCallback.name,
      navigationStrategy: instruction => this.signOutStrategy(instruction),
      route: this.getPath(ROUTES.signoutRedirectCallback.url)
    });
  }

  /**
   * Defines the navigation strategy for /signin-oidc route after a signin.
   * @param {NavigationInstruction} instruction - the aurelia router instruction
   * @return {Promise} the navigation strategy promise
   */
  async signInStrategy(instruction) {
    let redirectRoute = '';
    const callback = async() => {
      Log.debug('OpenidRouting.signInStrategy: finishing signin redirection...');
      const user = await this._userManager.signinRedirectCallback();
      if (this._configuration.redirectsOnClaim && this._configuration.redirectsOnClaim(user.profile)) {
        redirectRoute = this._configuration.redirectsOnClaim(user.profile);
        Log.debug(`OpenidRouting.signInStrategy: selecting redirect route from claims: ${redirectRoute}.`);
      } else if (user.state) {
        redirectRoute = user.state;
        Log.debug(`OpenidRouting.signInStrategy: selecting redirect route from state: ${redirectRoute}.`);
      }
      Log.info(`OpenidRouting.signInStrategy: finished signin redirection to ${redirectRoute}.`);
    };
    const navigationInstruction = () => {
      instruction.config.redirect = redirectRoute;
    };
    return await this.runAndCompleteNavigationInstruction(callback, navigationInstruction);
  }

  /**
   * Defines the navigation strategy for /signin-oidc route after a silent signin.
   * @param {NavigationInstruction} instruction - the aurelia router instruction
   * @return {Promise} the navigation strategy promise
   */
  async silentSignInStrategy(instruction) {
    Log.debug('OpenidRouting.silentSignInStrategy: finishing silent signin redirection...');
    await this._userManager.signinSilentCallback();
    Log.info('OpenidRouting.silentSignInStrategy: finished silent signin redirection.');
    instruction.config.redirect = '';
  }

  /**
   * Defines the navigation strategy for /signout-oidc route after a signout.
   * @param {NavigationInstruction} instruction - the aurelia router instruction
   * @return {Promise} the navigation strategy promise
   */
  async signOutStrategy(instruction) {
    let redirectRoute = '';
    const callback = async() => {
      Log.debug('OpenidRouting.signOutStrategy: finishing signout redirection...');
      const response = await this._userManager.signoutRedirectCallback();
      if (response.state) {
        redirectRoute = response.state;
      }
      Log.info(`OpenidRouting.signOutStrategy: finished signout redirection to ${redirectRoute}.`);
    };
    const navigationInstruction = () => {
      instruction.config.redirect = redirectRoute;
      //instruction.queryString = 'fromSignout=1';
    };
    return await this.runAndCompleteNavigationInstruction(callback, navigationInstruction);
  }

  /**
   * Gets the anchor path to the given uri.
   * @param {string} uri - the specified uri
   * @return {string} the path
   */
  getPath(uri) {
    return this.convertUriToAnchor(uri).pathname;
  }

  /**
   * Converts the given uri to an anchor element.
   * @param {string} uri - the specified uri
   * @return {HTMLAnchorElement} the anchor element
   */
  convertUriToAnchor(uri) {
    const anchor = document.createElement('a');
    anchor.href = uri;
    return anchor;
  }

  async runAndCompleteNavigationInstruction(func, navigationInstruction) {
    try {
      await func();
      navigationInstruction();
    } catch (err) {
      navigationInstruction();
      throw err;
    }
  }

}
