import clsx from 'clsx';

//--- Event Handler Utilities ---//

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

//--- Prop Merging and Overriding Utilities ---//

export function isHostComponent(element) {
  return typeof element === 'string';
}

export const shouldSpreadAdditionalProps = (Slot) => {
  return !Slot || !isHostComponent(Slot);
};

export function appendOwnerState(elementType, otherProps, ownerState) {
  if (elementType === undefined || isHostComponent(elementType)) {
    return otherProps;
  }

  return {
    ...otherProps,
    ownerState: { ...otherProps?.ownerState, ...ownerState }
  };
}

export function mergeProps(defaultProps, props) {
  const output = { ...props };

  for (const propName in defaultProps) {
    const defaultProp = defaultProps[propName];
    const prop = props[propName];

    if (propName === 'slots') {
      output[propName] = { ...defaultProp, ...prop };
    } else if (propName === 'slotProps') {
      const defaultSlotProps = defaultProp || {};
      const slotProps = prop || {};

      output[propName] = Object.keys(defaultSlotProps).reduce(
        (acc, slotPropName) => {
          acc[slotPropName] = mergeProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
          return acc;
        },
        { ...slotProps }
      );
    } else {
      output[propName] = output[propName] ?? defaultProp;
    }
  }

  return output;
}

export function mergeSlotProps(parameters) {
  const { getSlotProps, additionalProps, externalSlotProps, externalForwardedProps, className } =
    parameters;

  if (!getSlotProps) {
    const joinedClasses = clsx(
      externalForwardedProps?.className,
      externalSlotProps?.className,
      className,
      additionalProps?.className
    );

    const mergedStyle = {
      ...additionalProps?.style,
      ...externalForwardedProps?.style,
      ...externalSlotProps?.style
    };

    const props = {
      ...additionalProps,
      ...externalForwardedProps,
      ...externalSlotProps
    };

    if (joinedClasses.length > 0) {
      props.className = joinedClasses;
    }

    if (Object.keys(mergedStyle).length > 0) {
      props.style = mergedStyle;
    }

    return {
      props,
      internalRef: undefined
    };
  }

  const eventHandlers = extractEventHandlers({ ...externalForwardedProps, ...externalSlotProps });
  const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
  const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);

  const internalSlotProps = getSlotProps(eventHandlers);

  const joinedClasses = clsx(
    internalSlotProps?.className,
    additionalProps?.className,
    className,
    externalForwardedProps?.className,
    externalSlotProps?.className
  );

  const mergedStyle = {
    ...internalSlotProps?.style,
    ...additionalProps?.style,
    ...externalForwardedProps?.style,
    ...externalSlotProps?.style
  };

  const props = {
    ...internalSlotProps,
    ...additionalProps,
    ...otherPropsWithoutEventHandlers,
    ...componentsPropsWithoutEventHandlers
  };

  if (joinedClasses.length > 0) {
    props.className = joinedClasses;
  }

  if (Object.keys(mergedStyle).length > 0) {
    props.style = mergedStyle;
  }

  return {
    props,
    internalRef: internalSlotProps.ref
  };
}

export function combineHooksSlotProps(getFirstProps, getSecondProps) {
  return (external) => {
    const firstResult = {
      ...external,
      ...getFirstProps(external)
    };

    const result = {
      ...firstResult,
      ...getSecondProps(firstResult)
    };

    return result;
  };
}

//--- Component and Prop Resolver Utilities ---//

export function resolveComponentProps(componentProps, ownerState) {
  if (typeof componentProps === 'function') {
    return componentProps(ownerState);
  }

  return componentProps;
}

//--- Object Cloning and Deep Merging ---//

export function isPlainObject(item) {
  return item !== null && typeof item === 'object' && item.constructor === Object;
}

function deepClone(source) {
  if (!isPlainObject(source)) {
    return source;
  }

  const output = {};

  Object.keys(source).forEach((key) => {
    output[key] = deepClone(source[key]);
  });

  return output;
}

export function deepmerge(target, source, options = { clone: true }) {
  const output = options.clone ? { ...target } : target;

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      // Avoid prototype pollution
      if (key === '__proto__') {
        return;
      }

      if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        output[key] = deepmerge(target[key], source[key], options);
      } else if (options.clone) {
        output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}
