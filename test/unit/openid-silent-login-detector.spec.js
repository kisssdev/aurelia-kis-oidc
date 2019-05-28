/**
 * @jest-environment jsdom
 */

import { OpenidSilentLoginDetector } from '../../src/openid-silent-login-detector';

describe('OpenidSilentLoginDetector', () => {
  describe('isSilentLogin()', () => {
    test('returns true when current Window is not top Window', () => {
      const window = { top: 1, self: 2 };
      const openidSilentLoginDetector = new OpenidSilentLoginDetector(window);
      expect(openidSilentLoginDetector.isSilentLogin()).toBe(true);
    });

    test('returns false when current Window is top Window', () => {
      const window = { top: 1, self: 1 };
      const openidSilentLoginDetector = new OpenidSilentLoginDetector(window);
      expect(openidSilentLoginDetector.isSilentLogin()).toBe(false);
    });

    test('returns true when there is an error', () => {
      class Window {

        get self() {
          throw new Error('');
        }

      }
      const window = new Window();
      const openidSilentLoginDetector = new OpenidSilentLoginDetector(window);
      expect(openidSilentLoginDetector.isSilentLogin()).toBe(true);
    });
  });
});
