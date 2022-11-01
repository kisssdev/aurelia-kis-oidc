[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm package](https://badge.fury.io/js/aurelia-kis-oidc.svg)](https://www.npmjs.com/package/aurelia-kis-oidc)
[![codecov](https://codecov.io/gh/kisssdev/aurelia-kis-oidc/branch/master/graph/badge.svg)](https://codecov.io/gh/kisssdev/aurelia-kis-oidc)

# aurelia-kis-oidc

An Aurelia plugin inspired by [aurelia-open-id-connect](https://github.com/aurelia-contrib/aurelia-open-id-connect) and based on the library [oidc-client-js](https://github.com/IdentityModel/oidc-client-js) that adapts the OpenID Connect Implicit Client protocol to the Aurelia router in a 'keep it simple' way.

- After a successful login to the OpenID provider, the access token is automatically attached to the http client, so that further calls to an OAuth2 protected web api will be authenticated.

- When a web api call is made, the plugin will check the access token validity. If the token has expired, the plugin will try to sign in the user silently in order to get a new access token.

- If the user has a valid browser session to the OpenID provider, a new access token is retrieved, and the web api is called transparently.

- If the silent login is not possible the user is prompted to login to the OpenID provider.

- After the successful login, the user is redirected to his original page.

## Features

- This plugin registers dynamically two routes (__signin-oidc__ and __signout-oidc__) within your application in order to implement the OpenID Connect Implicit Client protocol.

- It implements an http interceptor that deals with silent login and bearer token.

- It is possible to redirect the application on a specific route based on the presence of a specific claim in the user profile (See the __redirectsOnClaim__ configuration property).

- There is a simulation mode that connect/disconnect the user without interacting with the OpenID provider (See the __simulation__ and __simulationUser__ configuration properties).

## Example

A full example written in typescript is available on the following [github repo](https://www.github.com/kisssdev/aurelia-kis-oidc-sample). The example is also available in live [here](https://aureliakisoidc.z16.web.core.windows.net/). It is using a Microsoft Azure B2C OpenID/OAuth2 provider and you can login using your GitHub, Microsoft or Google account.

## Installation

1. Install the plugin:

   ```node
   npm install aurelia-kis-oidc
   ```

1. Call the plugin:

   ```javascript
   // in your main.js or main.ts
   export function configure(aurelia) {
     aurelia.use
       .standardConfiguration()
       .plugin(PLATFORM.moduleName('aurelia-kis-oidc'), () => configureOpenidPlugin(aurelia))
   ```

1. Define the plugin configuration method:

   ```javascript
   function configureOpenidPlugin(aurelia) {
     return {
       userIdClaimSelector: profile => profile.emails[0],
       reconnectPrompt: loginFunc =>
         iziToast.show({
           title: 'Session expired',
           message: 'Please reconnect',
           buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
         }),
       userManagerSettings: {
         // your oidc-client-js configuration
       }
     }
   }
   ```

1. Connect the router and the httpclient with the plugin:

   ```javascript
   // in your app.js or app.ts
   import { inject } from 'aurelia-framework';
   import { HttpClient } from 'aurelia-fetch-client';
   import { OpenidRouting, Oauth2Interceptor } from 'aurelia-kis-oidc';

   @inject(OpenidRouting, HttpClient, Oauth2Interceptor)
   export class App {

     constructor(openidRouting, client, authInterceptor) {
       this.openidRouting = openidRouting;
       this.configureHttpClient(client, authInterceptor);
     }

     configureRouter(configuration, router) {
       ...
       // required
       configuration.options.pushState = true;
       // add dynamically routes for OpenID Connect
       this.openidRouting.configureRouter(configuration);
       ...
     }

     configureHttpClient(client, authInterceptor) {
       return client.configure(config => {
         config
           .withDefaults({
             headers: {
               'Access-Control-Allow-Credentials': 'true',
               'Accept': 'application/json'
             },
             credentials: 'include',
             mode: 'cors'
           })
           .rejectErrorResponses()
           .withInterceptor(authInterceptor)
       });
     }
   ```

## User interface

This plugin does not come with any user interface element but it provides a [Connection](./doc/src_connection.md) class that encapsulates the OpenID Connect user connection. Just inject the Connection class within your viewmodel and bind your html elements to it.

```javascript
//login.js
import { inject } from 'aurelia-framework';
import { Connection } from 'aurelia-kis-oidc';

@inject(Connection)
export class Login {
  constructor(connection) {
    this.connection = connection;
  }
```

```html
<!-- login.html -->
<template>
  <!-- a login button -->
  <button click.trigger="connection.loginUser()">
    Login
  </button>
  <!-- a conditional lougout link with user name -->
  <a if.bind="connection.isUserLoggedIn" click.trigger="connection.logoutUser()">
    Logout ${connection.userId}
  </a>
</template>
```

You can change the claim that is used to represent the identifier of the user (property userId): see the __userIdClaimSelector__ configuration property.

You can also change the user prompt interface when the session has expired: see the __reconnectPrompt__ configuration property.

## Configuration options

You can define specific options in the configuration returned by the __configureOpenidPlugin__ function.

### `userIdClaimSelector`

Function that defines the profile claim used as user identifier.

_Example:_

 ```javascript
 /**
 * Defines the profile claim used as user identifier.
 * @param {Object} profile - the user profile containing claims
 * @return {string} the user identifier
 */
const userIdClaimSelector = profile => profile.emails[0];
 ```

If you do not define this option, the default claim used is the __name__ claim.

### `reconnectPrompt`

_Function that defines the user prompt to reconnect the session when it is expired._

By default, it displays the native browser prompt.

_Here's an example with the [iziToast](https://github.com/marcelodolza/iziToast) component:_

 ```javascript
/**
 * Implements the reconnect prompt with izitoast component.
 * @param {I18N} i18n -  the translation plugin
 * @return {function} the function called to reconnect the session
 */
const reconnectPrompt = loginFunc => {
  iziToast.show({
    theme: 'dark',
    title: 'Session expired!',
    message: 'Please reconnect...',
    buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
  });
};
```

### `loginRequiredSelector`

To determine that the silent login is not possible the OpenID provider will return an error. The plugin must handle the correct error code in order to show the reconnect prompt. The __loginRequiredSelector__ function defines this code analysis.
The default function is the following (which is what Microsoft Azure B2C authentication currently returns when silent login is no more available):

```javascript
error => error.error === 'interaction_required';
```

You can customize it. For instance this is the function I use for an application authenticated by Azure Active Directory (and it should be the same for Azure B2B authentication):

```javascript
error => error.error === 'login_required';
```

### `redirectsOnClaim`

Sometimes you want to redirect the router to a specific route after the login when a special claim is present.

For instance, with __Azure B2C__ there is a special claim when the user has just created his account.

You can use the __redirectsOnClaim__ function for that.

_Example:_

 ```javascript
 /**
 * Defines the redirect route based on specific profile claims.
 * @param {Object} profile - the user profile containing claims
 * @return {string} the route name or undefined
 */
 const redirectsOnClaim = profile => {
   // redirect newly created users to the settings view
   if (profile?.newUser) return 'settings';
 };
 ```

### `onError`

Sometimes the oicd provider may return an error during the response callback.

You can use the __onError__ callback to retrieve the error.

_Example:_

 ```javascript
 const onError = error => {
   // for instance for errors returned by Azure AD
   console.log(error.error_description);
 };
 ```

### `userManagerSettings`

This object is the exact configuration object of the openid-client-js library.

See [oidc-client-js](https://github.com/IdentityModel/oidc-client-js/wiki) wiki.

The __redirect_uri__ must be:
`https://whatever_your_aurelia_app_url/signin-oidc`

If you specify __post_logout_redirect_uri__ it should be:
`https://whatever_your_aurelia_app_url/signout-oidc`

### `simulation`

This boolean is for __development__ purpose only. It enables to bypass the OpenID provider dialog and to connect virtually the user.

When you call the `loginUser` method of the [Connection](doc/src_connection.md) class the user is automatically connected as the default following user:

```javascript
{
  profile: { name: 'Test User' },
  expired: false,
  access_token: '0123456789'
}
```

You can define your own user object: see the __simulationUser__ configuration property.

When you call `logoutUser` of the [Connection](doc/src_connection.md) class the user is automatically disconnected.

Of course as the access token is fake you won't be able to call a protected web api.

### `simulationUser`

This object enables you to define a custom connected user that should fit your needs.

_Example:_

```javascript
simulationUser: {
      profile: { name: 'J.DOE', emails: ['john.doe@sample.com']},
      expired: false,
      access_token: '0123456789'
    },
```

## Project documentation

The project documentation has been generated with jsdoc and the [kis-jsdoc-plugin](https://github.com/kisssdev/kis-jsdoc-plugin).

The [table of content](./doc/toc.md) is here.
