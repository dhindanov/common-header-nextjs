import axios from "axios";

export const client = context =>
  axios.create({
    baseURL: context.apiHost,
    withCredentials: true,
  });

/**
 * Request wrapper with default success/error actions
 */
export const request = (options, context) => {
  const onSuccess = response => {
    return response.data;
  };

  const onError = error => {
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
    } else {
      // Something else happened while setting up the request
      // triggered the error
    }

    return Promise.reject(error.response || error.message);
  };

  // if context is given to request, there should always be a token in context
  if (context) {
    options.headers = {
      ...options.headers,
      "Api-Key": context.apiKey,
    };

    if (context.authToken) {
      options.headers = {
        ...options.headers,
        Authorization: "Bearer " + context.authToken,
      };
    }
  }

  return client(context)(options).then(onSuccess).catch(onError);
};
