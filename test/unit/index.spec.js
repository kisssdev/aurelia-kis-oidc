/**
 * @jest-environment jsdom
 */

import { configure } from '../../src/index';

// mock oidc UserManager constructor
jest.mock('oidc-client');
import { UserManager } from 'oidc-client';
UserManager.mockImplementation(conf => ({
  passedConfiguration: conf
}));

const config = { simulation: true, userManagerSettings: { authority: 'test' }};
const mockAurelia = { container: { registerInstance: jest.fn(() => {}) }};
const configurationCallback = jest.fn(() => config);

describe('index', () => {
  test('configure() calls the plugin configuration callback', () => {
    configure(mockAurelia, configurationCallback);
    expect(configurationCallback).toBeCalled();
  });

  test('configure() registers an instance of UserManager passing it a subset of the configuration', () => {
    //const expectedClass = 'UserManager';
    configure(mockAurelia, configurationCallback);
    //expect(mockAurelia.container.registerInstance.mock.calls[0][0].name).toBe(expectedClass);
    expect(mockAurelia.container.registerInstance.mock.calls[0][1].passedConfiguration).toBe(config.userManagerSettings);
  });

  test('configure() registers an instance of PluginConfiguration corresponding to the configuration callback call', () => {
    const expectedClass = 'PluginConfiguration';
    configure(mockAurelia, configurationCallback);
    expect(mockAurelia.container.registerInstance.mock.calls[1][0].name).toBe(expectedClass);
    expect(mockAurelia.container.registerInstance.mock.calls[1][1]).toBe(config);
  });

});
