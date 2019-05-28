import { getCurrentRouteInfo, ROUTES, defaultReconnectPrompt, defaultUserIdClaimSelector } from '../../src/constants';

describe('constants', () => {
  test('ROUTES.signinRedirectCallback defines a new route with "signin-oidc" url', () => {
    const expectedUrl = 'signin-oidc';
    expect(ROUTES.signinRedirectCallback.url).toBe(expectedUrl);
  });

  test('ROUTES.signoutRedirectCallback defines a new route with "signout-oidc" url', () => {
    const expectedUrl = 'signout-oidc';
    expect(ROUTES.signoutRedirectCallback.url).toBe(expectedUrl);
  });

  test('getCurrentRouteInfo extracts the fragment of the navigation instruction if it not null', () => {
    const expectedFragment = 'fragment';
    const mockNavigationInstruction = { fragment: expectedFragment };
    const result = getCurrentRouteInfo(mockNavigationInstruction);
    expect(result).toBe(expectedFragment);
  });

  test('getCurrentRouteInfo returns undefined if the navigation instruction is null', () => {
    const mockNavigationInstruction = null;
    const result = getCurrentRouteInfo(mockNavigationInstruction);
    expect(result).toBe(undefined);
  });

  test('getCurrentRouteInfo returns undefined if the navigation instruction is undefined', () => {
    const mockNavigationInstruction = undefined;
    const result = getCurrentRouteInfo(mockNavigationInstruction);
    expect(result).toBe(undefined);
  });

  test('defaultUserIdClaimSelector extracts the name of the profile', () => {
    const expectedName = 'name';
    const mockProfile = { name: expectedName };
    const result = defaultUserIdClaimSelector(mockProfile);
    expect(result).toBe(expectedName);
  });

  test('defaultReconnectPrompt calls browser confirm function', () => {
    const confirmStub = jest.fn();
    global.confirm = confirmStub;
    const promptCallback = () => {};
    defaultReconnectPrompt(promptCallback);
    expect(confirmStub).toBeCalled();
  });

  test('defaultReconnectPrompt calls yesFunc callback when confim prompt is confirmed', () => {
    const confirmStub = jest.fn();
    confirmStub.mockReturnValue(true);
    global.confirm = confirmStub;
    const promptCallback = jest.fn();
    defaultReconnectPrompt(promptCallback);
    expect(promptCallback).toBeCalled();
  });

  test('defaultReconnectPrompt does nothing when confim prompt is canceled', () => {
    const confirmStub = jest.fn();
    confirmStub.mockReturnValue(false);
    global.confirm = confirmStub;
    const promptCallback = jest.fn();
    defaultReconnectPrompt(promptCallback);
    expect(promptCallback).not.toBeCalled();
  });
});
