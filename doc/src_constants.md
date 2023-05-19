# Module `constants`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)

Defines the Aurelia plugin constants.

[Source file](..\src\constants.js)

## Constants

### `getCurrentRouteInfo`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Gets the useful part of the navigation instruction for redirecting within the aurelia application.

Parameters | Type | Description
--- | --- | ---
__instruction__ | [NavigationInstruction](https://aurelia.io/docs/api/router/class/NavigationInstruction) | *the navigation instruction*
__*return*__ | `string` | *- the useful part of the navigation instruction*

#### Value

```javascript
instruction => instruction?.fragment
```

---

### `ROUTES`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

The routes definitions to add for OpenID Connect.

#### Value

```javascript
{
  signinRedirectCallback: { name: 'signinRedirectCallback', url: 'signin-oidc' },
  signoutRedirectCallback: { name: 'signoutRedirectCallback', url: 'signout-oidc' }
}
```

---

### `defaultReconnectPrompt`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default reconnection prompt based on the Window.confirm() method.

Parameters | Type | Description
--- | --- | ---
__yesFunc__ | `function` | *the callback function when the user confirms the reconnection prompt*

#### Value

```javascript
yesFunc => {
  // eslint-disable-next-line no-alert
  if (confirm('Session expired. Reconnect?')) yesFunc();
}
```

---

### `defaultUserIdClaimSelector`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default claim that represents the user identifier.The default claim is &quot;name&quot;.

Parameters | Type | Description
--- | --- | ---
__profile__ | `Object` | *the user profile containing claims*
__*return*__ | `string` | *- the value of the claim that represents the user identifier*

#### Value

```javascript
profile => profile.name
```

---

### `defaultLoginRequiredSelector`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default silent login failure analysis to determine that a complete login is required.

Parameters | Type | Description
--- | --- | ---
__error__ | `Object` | *the error object returned by the identity provider on silent login*
__*return*__ | `bool` | *- the condition on this object to trigger the complete login*

#### Value

```javascript
error => error.error === 'interaction_required'
```

---

### `defaultSimulationUser`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default user in simulation mode.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `Object` | *- the default user*

#### Value

```javascript
{
  profile: { name: 'Test User' },
  expired: false,
  access_token: '0123456789'
}
```

---

### `defaultOnError`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default onError callback.

Parameters | Type | Description
--- | --- | ---
__error__ | `Object` | *the error object returned by the identity provider*

#### Value

```javascript
error => {}
```

---
