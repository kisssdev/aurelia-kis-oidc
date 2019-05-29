/**
 * Defines the Aurelia plugin constants.
 * @module
 * @category internal
 */

/**
 * Gets the useful part of the navigation instruction for redirecting within the aurelia application.
 * @param {NavigationInstruction} instruction - the navigation instruction
 * @return {string} - the useful part of the navigation instruction
 */
export const getCurrentRouteInfo = instruction => instruction?.fragment;

/**
 * The routes definitions to add for OpenID Connect.
 */
export const ROUTES = {
  signinRedirectCallback: { name: 'signinRedirectCallback', url: 'signin-oidc' },
  signoutRedirectCallback: { name: 'signoutRedirectCallback', url: 'signout-oidc' }
};

/**
 * Defines the default reconnection prompt based on the Window.confirm() method.
 * @param {function} yesFunc - the callback function when the user confirms the reconnection prompt
 */
export const defaultReconnectPrompt = yesFunc => {
  // eslint-disable-next-line no-alert
  if (confirm('Session expired. Reconnect?')) yesFunc();
};

/**
 * Defines the default claim that represents the user identifier.
 * The default claim is "name".
 * @param {Object} profile - the user profile
 * @return {string} - the claim that represents the user identifier
 */
export const defaultUserIdClaimSelector = profile => profile.name;
