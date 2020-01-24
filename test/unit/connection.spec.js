import { Connection } from '../../src/connection';
import { defaultUserIdClaimSelector, defaultSimulationUser } from '../../src/constants';

// mock oidc Log function
jest.mock('oidc-client');
import { Log } from 'oidc-client';

class IdpError extends Error {

  constructor(message, ...params) {
    super(...params);
    this.error = message;
  }

}

const expectedName = 'name';
const expectedClaimValue = 'test';
const expectedAccessToken = '1234';
const expectedExpiresIn = 1234;
const expectedUser = {
  profile: { name: expectedName, test: expectedClaimValue },
  expires_in: expectedExpiresIn,
  access_token: expectedAccessToken,
  expired: false
};
const expectedExpiredUser = {
  profile: { name: expectedName, test: expectedClaimValue },
  expires_in: 0,
  access_token: expectedAccessToken,
  expired: true
};
const expectedNotConnectedUser = {
  profile: undefined,
  access_token: undefined,
  expires_in: undefined,
  expired: true
};
const expectedFragment = 'url/fragment';
const mockRouter = { currentInstruction: { fragment: expectedFragment }};

let mockGetUser;
let mockUserManager;
let mockUserPrompt;

describe('Connection', () => {
  beforeEach(() => {
    mockGetUser = jest.fn();
    mockUserManager = {
      settings: {
        metadata: {
          end_session_endpoint: 'test'
        }
      },
      getUser: mockGetUser.mockResolvedValue(expectedUser),
      removeUser: jest.fn(),
      signinRedirect: jest.fn(),
      signoutRedirect: jest.fn(),
      signinSilent: jest.fn(),
      events: {
        addUserLoaded: jest.fn(func => (mockUserManager._userLoadedHandler = func)),
        addUserUnloaded: jest.fn(func => (mockUserManager._userUnLoadedHandler = func))
      },
      emitUserLoadedEvent: user => mockUserManager._userLoadedHandler(user),
      emitUserUnLoadedEvent: user => mockUserManager._userUnLoadedHandler(user)
    };
    mockUserPrompt = jest.mock('../../src/user-prompt');
  });

  describe('ctor()', () => {
    test('uses a default claim selector if none specified', () => {
      const connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
      expect(connection._userIdClaimSelector).toBe(defaultUserIdClaimSelector);
    });

    test('uses the configured claim selector', () => {
      const expectedClaimSelector = profile => profile.test;
      const configuration = {
        userIdClaimSelector: expectedClaimSelector
      };
      const connection = new Connection({}, configuration, mockUserManager, mockUserPrompt);
      expect(connection._userIdClaimSelector).toBe(expectedClaimSelector);
    });

    test('uses the default simulationUser', () => {
      const expectedSimulationUser = defaultSimulationUser;
      const configuration = {
        simulation: true
      };
      const connection = new Connection({}, configuration, mockUserManager, mockUserPrompt);
      expect(connection._simulationUser).toBe(expectedSimulationUser);
    });

    test('uses the configured simulationUser', () => {
      const expectedSimulationUser = expectedUser;
      const configuration = {
        simulation: true,
        simulationUser: expectedUser
      };
      const connection = new Connection({}, configuration, mockUserManager, mockUserPrompt);
      expect(connection._simulationUser).toBe(expectedSimulationUser);
    });

    test('hooks up UserManager user loaded event', () => {
      const connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
      expect(mockUserManager.events.addUserLoaded).toBeCalled();
    });

    test('hooks up UserManager user unloaded event', () => {
      const connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
      expect(mockUserManager.events.addUserUnloaded).toBeCalled();
    });

    test('does not hooks up UserManager user events in simulation mode', () => {
      const connection = new Connection({}, { simulation: true }, mockUserManager, mockUserPrompt);
      expect(mockUserManager.events.addUserLoaded).not.toBeCalled();
      expect(mockUserManager.events.addUserUnloaded).not.toBeCalled();
    });
  });

  describe('observeUser()', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('sets the current user', () => {
      expect(connection.user).toBe(expectedUser);
    });

    test('sets the current user on user loaded event', () => {
      mockUserManager.emitUserLoadedEvent(expectedExpiredUser);
      expect(connection.user).toBe(expectedExpiredUser);
    });

    test('sets the current user on user unloaded event', () => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(connection.user).toBe(null);
    });
  });

  describe('userId', () => {
    test('returns the name claim by default', async() => {
      const connection = await new Connection({}, {}, mockUserManager, mockUserPrompt);
      expect(connection.userId).toBe(expectedName);
    });

    test('returns the claim specified by the claim selector if configured', async() => {
      const expectedClaimSelector = profile => profile.test;
      const configuration = {
        userIdClaimSelector: expectedClaimSelector
      };
      const connection = await new Connection({}, configuration, mockUserManager, mockUserPrompt);
      expect(connection.userId).toBe(expectedClaimValue);
    });

    test('returns empty string if user is null', () => {
      const connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(connection.userId).toBe('');
    });
  });

  describe('isUserLoggedIn', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns true if user is defined', () => {
      expect(connection.isUserLoggedIn).toBe(true);
    });

    test('returns false if user is null', () => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(connection.isUserLoggedIn).toBe(false);
    });
  });

  describe('inProgress', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('is falsy by default', () => {
      expect(connection.inProgress).toBeFalsy();
    });

    test('returns false after successful trySilentLogin()', async() => {
      await connection.trySilentLogin();
      expect(connection.inProgress).toBe(false);
    });

    test('returns false after failed trySilentLogin()', async() => {
      mockUserManager.signinSilent = () => {
        throw new Error('');
      };
      try {
        await connection.trySilentLogin();
      } catch {}
      expect(connection.inProgress).toBe(false);
    });
  });

  describe('hasValidAccessToken', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns true if user has valid access token', () => {
      expect(connection.hasValidAccessToken).toBe(true);
    });

    test('returns false if user has expired access token', () => {
      mockUserManager.emitUserLoadedEvent(expectedExpiredUser);
      expect(connection.hasValidAccessToken).toBe(false);
    });

    test('returns false if user has no access token', () => {
      mockUserManager.emitUserUnLoadedEvent(expectedNotConnectedUser);
      expect(connection.hasValidAccessToken).toBe(false);
    });

    test('returns false if user is null', () => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(connection.hasValidAccessToken).toBe(false);
    });
  });

  describe('accessToken', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns the token if user is defined', async() => {
      expect(await connection.accessToken).toBe(expectedAccessToken);
    });

    test('returns undefined if user is not connected', () => {
      mockUserManager.emitUserUnLoadedEvent(expectedNotConnectedUser);
      expect(connection.accessToken).toBe(undefined);
    });

    test('returns undefined if user is null', () => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(connection.accessToken).toBe(undefined);
    });
  });

  describe('userName', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns the name if user is defined', async() => {
      expect(await connection.userName).toBe(expectedName);
    });

    test('returns undefined if user is not connected', async() => {
      mockUserManager.emitUserUnLoadedEvent(expectedNotConnectedUser);
      expect(await connection.userName).toBe(undefined);
    });

    test('returns undefined if user is null', async() => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(await connection.userName).toBe(undefined);
    });
  });

  describe('profile', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns the profile if user is defined', async() => {
      expect(await connection.profile).toBe(expectedUser.profile);
    });

    test('returns undefined if user is not connected', async() => {
      mockUserManager.emitUserUnLoadedEvent(expectedNotConnectedUser);
      expect(await connection.profile).toBe(undefined);
    });

    test('returns undefined if user is null', async() => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(await connection.profile).toBe(undefined);
    });
  });

  describe('expiresIn', () => {
    let connection;
    beforeEach(() => {
      connection = new Connection({}, {}, mockUserManager, mockUserPrompt);
    });

    test('returns the profile if user is defined', async() => {
      expect(await connection.expiresIn).toBe(expectedExpiresIn);
    });

    test('returns undefined if user is not connected', async() => {
      mockUserManager.emitUserUnLoadedEvent(expectedNotConnectedUser);
      expect(await connection.expiresIn).toBe(undefined);
    });

    test('returns undefined if user is null', async() => {
      mockUserManager.emitUserUnLoadedEvent(null);
      expect(await connection.expiresIn).toBe(undefined);
    });
  });

  describe('loginUser()', () => {
    test('sets the simulationUser as user in simulation mode', async() => {
      const expectedSimulationUser = expectedUser;
      const configuration = {
        simulation: true,
        simulationUser: expectedUser
      };
      const connection = new Connection(mockRouter, configuration, mockUserManager, mockUserPrompt);
      await connection.loginUser();
      expect(connection.user).toBe(expectedSimulationUser);
    });

    test('starts signin redirection with specified route', async() => {
      const expectedRoute = 'test';
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.loginUser(expectedRoute);
      expect(mockUserManager.signinRedirect.mock.calls[0][0].state).toBe(expectedRoute);
    });

    test('starts signin redirection with current route if no route specified', async() => {
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.loginUser();
      expect(mockUserManager.signinRedirect.mock.calls[0][0].state).toBe(expectedFragment);
    });

    test('logs error if signin redirection failed', async() => {
      mockUserManager.signinRedirect = () => {
        throw new Error('');
      };
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      try {
        await connection.loginUser();
      } catch {}
      expect(Log.error).toBeCalled();
    });
  });

  describe('logoutUser()', () => {
    test('resets the user in simulation mode', async() => {
      const configuration = {
        simulation: true,
        simulationUser: expectedUser
      };
      const connection = new Connection(mockRouter, configuration, mockUserManager, mockUserPrompt);
      await connection.logoutUser();
      expect(connection.user).toBe(null);
    });

    test('removes the user in local storage when no end_session_endpoint', async() => {
      mockUserManager.settings.metadata.end_session_endpoint = undefined;
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.logoutUser();
      expect(mockUserManager.removeUser).toBeCalled();
    });

    test('starts signout redirection with specified route', async() => {
      const expectedRoute = 'test';
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.logoutUser(expectedRoute);
      expect(mockUserManager.signoutRedirect.mock.calls[0][0].state).toBe(expectedRoute);
    });

    test('starts signout redirection with current route if no route specified', async() => {
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.logoutUser();
      expect(mockUserManager.signoutRedirect.mock.calls[0][0].state).toBe(expectedFragment);
    });

    test('logs error if signout redirection failed', async() => {
      mockUserManager.signoutRedirect = () => {
        throw new Error('');
      };
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      try {
        await connection.logoutUser();
      } catch {}
      expect(Log.error).toBeCalled();
    });
  });

  describe('trySilentLogin()', () => {
    test('sets the simulationUser as user in simulation mode', async() => {
      const expectedSimulationUser = expectedUser;
      const configuration = {
        simulation: true,
        simulationUser: expectedUser
      };
      const connection = new Connection(mockRouter, configuration, mockUserManager, mockUserPrompt);
      await connection.trySilentLogin();
      expect(connection.user).toBe(expectedSimulationUser);
    });

    test('starts silent login redirection with specified route', async() => {
      const expectedRoute = 'test';
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.trySilentLogin(expectedRoute);
      expect(mockUserManager.signinSilent.mock.calls[0][0].state).toBe(expectedRoute);
    });

    test('starts silent login redirection with current route if no route specified', async() => {
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      await connection.trySilentLogin();
      expect(mockUserManager.signinSilent.mock.calls[0][0].state).toBe(expectedFragment);
    });

    test('logs error if silent login redirection failed', async() => {
      mockUserManager.signinSilent = () => {
        throw new Error('');
      };
      const connection = new Connection(mockRouter, {}, mockUserManager, mockUserPrompt);
      try {
        await connection.trySilentLogin();
      } catch {}
      expect(Log.error).toBeCalled();
    });

    test('prompts user for reconnection if error is "interaction_required"', async() => {
      mockUserManager.signinRedirect = jest.fn();
      mockUserManager.signinSilent = () => {
        throw new IdpError('interaction_required');
      };
      const yesUserPrompt = { reconnectPrompt: yesFunc => yesFunc() };
      const connection = new Connection(mockRouter, {}, mockUserManager, yesUserPrompt);
      try {
        await connection.trySilentLogin();
      } catch {}
      expect(mockUserManager.signinRedirect).toBeCalled();
    });
  });
});
