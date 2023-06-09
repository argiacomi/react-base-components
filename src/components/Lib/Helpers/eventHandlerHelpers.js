export function extractEventHandlers(object, excludeKeys = []) {
  if (object === undefined) {
    return {};
  }

  const result = {};

  Object.keys(object)
    .filter(
      (prop) =>
        prop.match(/^on[A-Z]/) && typeof object[prop] === 'function' && !excludeKeys.includes(prop)
    )

    .forEach((prop) => {
      result[prop] = object[prop];
    });

  return result;
}

export function omitEventHandlers(object) {
  if (object === undefined) {
    return {};
  }

  const result = {};

  Object.keys(object)
    .filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === 'function'))
    .forEach((prop) => {
      result[prop] = object[prop];
    });

  return result;
}
