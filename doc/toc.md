# Code documentation

## Table of contents

* ![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)
  * [connection](src_connection.md) - _Provides an encapsulation of the OpenID Connect user connection._
  * [oauth2-interceptor](src_oauth2-interceptor.md) - _Implements a custom interceptor that sets OAuth2 bearer token andobtains a new token when expired.Use this class to configure your http client to intercept 401 error to try a silent loginand to add the bearer token._
  * [openid-routing](src_openid-routing.md) - _Extends the aurelia application router to support the OpenID Connect redirections.Use this class in app.js to configure your router for OpenID Connect._

* ![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)
  * [constants](src_constants.md) - _Defines the Aurelia plugin constants._
  * [index](src_index.md) - _Defines the Aurelia plugin entry point._
  * [openid-silent-login-detector](src_openid-silent-login-detector.md) - _Implements the logic to find out the correct OpenID Connect flow._
  * [plugin-configuration](src_plugin-configuration.md) - _Defines the configuration for the openid plugin._
  * [user-prompt](src_user-prompt.md) - _Defines the user prompt service of the plugin._

