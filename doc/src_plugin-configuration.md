# Module `plugin-configuration`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)



[Source file](..\src\plugin-configuration.js)

# Class `PluginConfiguration`

Defines the configuration for the openid plugin.

## Members

Name | Type | Description
--- | --- | ---
__simulation__ | `boolean` | *Activates the simulation where the login/logout is only simulated. You can define a related simulationUser.*
__simulationUser__ | `Object` | *User object that defines the connected user when simulation is enable.*
__userIdClaimSelector__ | `string` | *Function that defines the profile claim used to represent user identifier.*
__loginRequiredSelector__ | `bool` | *Function that defines the silent login failure analysis to determine that a complete login is required.*
__redirectsOnClaim__ | `function` | *Function that defines the redirect route name based on the presence of specific profile claims.*
__reconnectPrompt__ | `function` | *Function that defines the reconnection prompt that will be displayed when a new connection is required.*
__userManagerSettings__ | `Object` | *Configuration object of the underlying oidc-client-js library. See https://github.com/IdentityModel/oidc-client-js/wiki for details.*
