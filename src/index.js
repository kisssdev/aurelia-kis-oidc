/**
 * Defines the Aurelia plugin entry point.
 * @module
 */

import { UserManager } from 'oidc-client';
import { PluginConfiguration } from './plugin-configuration';

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia - the aurelia framework configuration
 * @param {*} pluginCallback - the plugin callback
 */
export function configure(aurelia, pluginCallback) {
  const pluginConfiguration = pluginCallback();
  aurelia.container.registerInstance(UserManager, new UserManager(pluginConfiguration.userManagerSettings));
  aurelia.container.registerInstance(PluginConfiguration, pluginConfiguration);
  aurelia.container.registerInstance(Window, window);
}
