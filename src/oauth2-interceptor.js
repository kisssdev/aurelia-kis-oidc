import { inject } from 'aurelia-framework';
import { Connection } from './connection';
import { Log } from 'oidc-client';
import { UserPrompt } from './user-prompt';
import { OpenidSilentLoginDetector } from './openid-silent-login-detector';

/**
 * Implements a custom interceptor that sets OAuth2 bearer token and
 * obtain a new token when expired.
 */
@inject(Connection, UserPrompt, OpenidSilentLoginDetector)
export class Oauth2Interceptor {

  /**
   * Creates an instance of the class with the specified parameters.
   * @param {Connection} connection - the OpenID Connect user connection
   * @param {UserPrompt} userPrompt - the user prompt to show error
   * @param {OpenidSilentLoginDetector} detector - the silent login detector
   */
  constructor(connection, userPrompt, detector) {
    this._connection = connection;
    this._errorPrompt = userPrompt.errorPrompt;
    this._detector = detector;
  }

  /**
   * Intercepts and handles the request.
   * @param {RequestMessage} request - the intercepted request
   */
  async request(request) {
    try {
      if (!this._connection.hasValidAccessToken && !this._detector.isSilentLogin()) {
        Log.info('Oauth2Interceptor.request: expired token, try silent login...');
        await this._connection.trySilentLogin();
      }
      request.headers.set('Authorization', `Bearer ${this._connection.accessToken}`);
      return request;
    } catch (error) {
      Log.error('Oauth2Interceptor.request: unable to obtain new token', error);
      throw error;
    }
  }

}
