import { inject } from 'aurelia-framework';
import { defaultReconnectPrompt } from './constants';
import { PluginConfiguration } from './plugin-configuration';

/**
 * Defines the user prompt service of the plugin.
 * @category internal
 */
@inject(PluginConfiguration)
export class UserPrompt {

  /**
   * Creates an instance of the class with the specified parameters.
   * @param {PluginConfiguration} configuration - the openid plugin configuration
   */
  constructor(configuration) {
    this.reconnectPrompt = configuration.reconnectPrompt || defaultReconnectPrompt;
  }

}
