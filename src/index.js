/**
 * Defines the Aurelia plugin entry point.
 * @module
 * @category internal
 */

import { UserManager } from 'oidc-client';
import { PluginConfiguration } from './plugin-configuration';
import { Oauth2Interceptor } from './oauth2-interceptor';
import { OpenidRouting } from './openid-routing';
import { Connection } from './connection';

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia - the aurelia framework configuration
 * @param {*} pluginCallback - the plugin callback
 */
function configure(aurelia, pluginCallback) {
  const pluginConfiguration = pluginCallback();
  aurelia.container.registerInstance(UserManager, new UserManager(pluginConfiguration.userManagerSettings));
  aurelia.container.registerInstance(PluginConfiguration, pluginConfiguration);
  aurelia.container.registerInstance(Window, window);
}

export { configure, Oauth2Interceptor, OpenidRouting, Connection };
