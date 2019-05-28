import { inject } from 'aurelia-framework';

/**
 * Implements the logic to find out the correct OpenID Connect flow.
 * @category internal
 */
@inject(Window)
export class OpenidSilentLoginDetector {

  /**
   * Creates an instance of the class with the given parameter.
   * @param {Window} browserWindow - the navigator windows object
   */
  constructor(browserWindow) {
    this._window = browserWindow;
  }

  /**
   * Is the requested login a silent login?
   * @return {boolean}
   */
  isSilentLogin() {
    try {
      return this._window.self !== this._window.top;
    } catch (error) {
      return true;
    }
  }

}
