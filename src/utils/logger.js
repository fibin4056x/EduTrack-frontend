const isDevelopment = import.meta.env.DEV;

export const createLogger = (scope) => {
  const prefix = `[${scope}]`;

  return {
    debug: (...args) => {
      if (isDevelopment) {
        console.debug(prefix, ...args);
      }
    },
    info: (...args) => {
      if (isDevelopment) {
        console.info(prefix, ...args);
      }
    },
    warn: (...args) => {
      console.warn(prefix, ...args);
    },
    error: (...args) => {
      console.error(prefix, ...args);
    },
  };
};
