export const getCurrentRouteInfo = instruction => instruction?.fragment;

export const ROUTES = {
  signinRedirectCallback: { name: 'signinRedirectCallback', url: 'signin-oidc' },
  signoutRedirectCallback: { name: 'signoutRedirectCallback', url: 'signout-oidc' }
};

export const defaultReconnectPrompt = yesFunc => {
  // eslint-disable-next-line no-alert
  if (confirm('Session expired. Reconnect?')) yesFunc();
};

export const defaultUserIdClaimSelector = profile => profile.name;
