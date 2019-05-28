# Module `Oauth2Interceptor`

![category:other](https://img.shields.io/badge/category-other-blue.svg?style=flat-square)



[Source file](..\src\oauth2-interceptor.js)

# Class `Oauth2Interceptor`

Implements a custom interceptor that sets OAuth2 bearer token and
obtain a new token when expired.

## Constructors

__Note: parameters are automatically instanciated and injected.__

### `Oauth2Interceptor(connection, userPrompt, detector)`

Creates an instance of the class with the specified parameters.

Parameters | Type | Description
--- | --- | ---
__connection__ | [Connection](src_connection.md) | *the OpenID Connect user connection*
__userPrompt__ | [UserPrompt](src_user-prompt.md) | *the user prompt to show error*
__detector__ | [OpenidSilentLoginDetector](src_openid-silent-login-detector.md) | *the silent login detector*

---

## Methods

### `request(request)`

![modifier: public](images/badges/modifier-public.png)

Intercepts and handles the request.

Parameters | Type | Description
--- | --- | ---
__request__ | `RequestMessage` | *the intercepted request*

---
