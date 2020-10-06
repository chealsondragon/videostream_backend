import { compile } from 'path-to-regexp';
import isEmpty from 'lodash/isEmpty';

const processURL = (pathRegex, params) => {
  if (isEmpty(params)) {
    return pathRegex;
  }
  const toPath = compile(pathRegex, { encode: encodeURIComponent });
  return toPath(params || {});
};

const abstractURL = (pathRegex) => (options) =>
  processURL(pathRegex, options);

export default {
  INDEX: abstractURL('/'),

  // Authentication
  AUTH: abstractURL('/auth'),
  LOGIN: abstractURL('/auth/login'),
  REGISTER: abstractURL('/auth/registeration'),
  FORGOT_PASSWORD: abstractURL('/auth/forgot-password'),
  CHANGE_PASSWORD: abstractURL('/change-password'),
  LOGOUT: abstractURL('/logout'),
  
  DASHBOARD: abstractURL('/dashboard'),
  PROFILE: abstractURL('/profile'),
  SEARCH: abstractURL('/search'),

  NOTFOUND: abstractURL('/notfound')
};
