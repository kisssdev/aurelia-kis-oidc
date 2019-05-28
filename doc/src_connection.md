# Module `Connection`

![category:other](https://img.shields.io/badge/category-other-blue.svg?style=flat-square)



[Source file](..\src\connection.js)

# Class `Connection`

Provides an encapsulation of the OpenID Connect user connection.

## Constructors

__Note: parameters are automatically instanciated and injected.__

### `Connection(router, configuration, userManager, userPrompt)`

Creates an instance of the class with the given parameter.

Parameters | Type | Description
--- | --- | ---
__router__ | [Router](https://aurelia.io/docs/api/router/class/AppRouter) | *the aurelia router*
__configuration__ | [PluginConfiguration](src_plugin-configuration.md) | *the openid plugin configuration*
__userManager__ | `UserManager` | *the openid user manager*
__userPrompt__ | [UserPrompt](src_user-prompt.md) | *the user prompt to confirm reconnection*

---

## Methods

### `observeUser(userfunc) ► Promise`

![modifier: public](images/badges/modifier-public.png)

Defines a callback called when user connection changes.

Parameters | Type | Description
--- | --- | ---
__userfunc__ | `function` | *a callback called when user connection changes*
__*return*__ | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | *the promise that*

---

### `loginUser(route)`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect user connection.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name that initiates the user connection*

---

### `logoutUser(route)`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect user deconnection.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name that initiates the user deconnection*

---

### `trySilentLogin(route)`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect silent user connection.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name that initiates the silent user connection*

---

### `_setUser(user)`

![modifier: private](images/badges/modifier-private.png)

Sets the connected user entity.

Parameters | Type | Description
--- | --- | ---
__user__ | `User` | *the OpenID Connect user*

---

## Members

Name | Type | Description
--- | --- | ---
__userId__ | `string` | *The user identifier. It may be undefined.*
__isUserLoggedIn__ | `boolean` | *Is the user currently connected?*
__hasValidAccessToken__ | `boolean` | *Has the user a valid access token?*
__accessToken__ | `string` | *The user access token. The token may be expired. Check hasValidAccessToken property before.*
__userName__ | `string` | *The display name of the user. The &#x27;name&#x27; claim is used to provide this information.*
