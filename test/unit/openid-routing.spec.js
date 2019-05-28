/**
 * @jest-environment jsdom
 */

import { OpenidRouting } from '../../src/openid-routing';
import { ROUTES } from '../../src/constants';

const expectedRouteFromState = 'state-route';
const expectedRouteFromClaim = 'claim-route';

const mockRouterConfiguration = { mapRoute: jest.fn() };
const mockDetector = { isSilentLogin: () => false };
const mockDetectorSilentLogin = { isSilentLogin: () => true };
const mockUserManager = {
  signinRedirectCallback: jest.fn().mockResolvedValue({}),
  signinSilentCallback: jest.fn().mockResolvedValue({}),
  signoutRedirectCallback: jest.fn().mockResolvedValue({})
};
const mockUserManagerWithState = {
  signinRedirectCallback: jest.fn().mockResolvedValue({ state: expectedRouteFromState }),
  signinSilentCallback: jest.fn().mockResolvedValue({ state: expectedRouteFromState }),
  signoutRedirectCallback: jest.fn().mockResolvedValue({ state: expectedRouteFromState })
};
const mockPluginConfiguration = { redirectsOnClaim: () => expectedRouteFromClaim };

describe('OpenidRouting', () => {
  describe('configureRouter()', () => {
    let mockInstruction;
    beforeEach(() => {
      mockInstruction = { config: { redirect: '' }};
    });

    test('defines signin and signout redirect routes', () => {
      mockRouterConfiguration.mapRoute.mockClear();
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      openidRouting.configureRouter(mockRouterConfiguration);
      expect(mockRouterConfiguration.mapRoute.mock.calls[0][0].name).toBe(ROUTES.signinRedirectCallback.name);
      expect(mockRouterConfiguration.mapRoute.mock.calls[1][0].name).toBe(ROUTES.signoutRedirectCallback.name);
    });

    test('defines navigation strategy for signin', async() => {
      mockRouterConfiguration.mapRoute.mockClear();
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      openidRouting.configureRouter(mockRouterConfiguration);
      openidRouting.signInStrategy = jest.fn();
      const navStrategy = mockRouterConfiguration.mapRoute.mock.calls[0][0].navigationStrategy;
      await navStrategy(mockInstruction);
      expect(openidRouting.signInStrategy).toBeCalled();
    });

    test('defines navigation strategy for silent signin', async() => {
      mockRouterConfiguration.mapRoute.mockClear();
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetectorSilentLogin);
      openidRouting.configureRouter(mockRouterConfiguration);
      openidRouting.silentSignInStrategy = jest.fn();
      const navStrategy = mockRouterConfiguration.mapRoute.mock.calls[0][0].navigationStrategy;
      await navStrategy(mockInstruction);
      expect(openidRouting.silentSignInStrategy).toBeCalled();
    });

    test('defines navigation strategy for signout', async() => {
      mockRouterConfiguration.mapRoute.mockClear();
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      openidRouting.configureRouter(mockRouterConfiguration);
      openidRouting.signOutStrategy = jest.fn();
      const navStrategy = mockRouterConfiguration.mapRoute.mock.calls[1][0].navigationStrategy;
      await navStrategy(mockInstruction);
      expect(openidRouting.signOutStrategy).toBeCalled();
    });
  });

  describe('signInStrategy()', () => {
    let mockInstruction;
    beforeEach(() => {
      mockInstruction = { config: { redirect: '' }};
    });

    test('finishes the signin redirection by selecting default route', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      await openidRouting.signInStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe('');
    });

    test('finishes the signin redirection by selecting state parameter', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManagerWithState, mockDetector);
      await openidRouting.signInStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe(expectedRouteFromState);
    });

    test('finishes the signin redirection by selecting redirectsOnClaim configuration', async() => {
      const openidRouting = new OpenidRouting(mockPluginConfiguration, mockUserManagerWithState, mockDetector);
      await openidRouting.signInStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe(expectedRouteFromClaim);
    });
  });

  describe('signOutStrategy()', () => {
    let mockInstruction;
    beforeEach(() => {
      mockInstruction = { config: { redirect: '' }};
    });

    test('finishes the signout redirection by selecting default route', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      await openidRouting.signOutStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe('');
    });

    test('finishes the signout redirection by selecting state parameter', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManagerWithState, mockDetector);
      await openidRouting.signOutStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe(expectedRouteFromState);
    });
  });

  describe('silentSignInStrategy()', () => {
    let mockInstruction;
    beforeEach(() => {
      mockInstruction = { config: { redirect: '' }};
    });

    test('finishes the silent signin redirection by selecting default route', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      await openidRouting.silentSignInStrategy(mockInstruction);
      expect(mockInstruction.config.redirect).toBe('');
    });
  });

  describe('runAndCompleteNavigationInstruction()', () => {
    let mockCallback;
    let mockNavigationInstruction;
    beforeEach(() => {
      mockCallback = jest.fn();
      mockNavigationInstruction = jest.fn();
    });

    test('runs callback then navigation instruction', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      await openidRouting.runAndCompleteNavigationInstruction(mockCallback, mockNavigationInstruction);
      expect(mockCallback).toBeCalled();
      expect(mockNavigationInstruction).toBeCalled();
    });

    test('runs navigation instruction when callback failed', async() => {
      const openidRouting = new OpenidRouting({}, mockUserManager, mockDetector);
      mockCallback = () => {
        throw new Error('');
      };
      try {
        await openidRouting.runAndCompleteNavigationInstruction(mockCallback, mockNavigationInstruction);
      } catch {}
      expect(mockNavigationInstruction).toBeCalled();
    });
  });
});
