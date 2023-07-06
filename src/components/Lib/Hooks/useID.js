import React from 'react';

let globalId = 0;
function useGlobalId(idOverride) {
  const [defaultId, setDefaultId] = React.useState(idOverride);
  const id = idOverride || defaultId;
  React.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`${globalId}`);
    }
  }, [defaultId]);
  return id;
}

const maybeReactUseId = React['useId'.toString()];

export function useId(idOverride) {
  if (maybeReactUseId !== undefined) {
    const reactId = maybeReactUseId();
    return idOverride ?? reactId;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useGlobalId(idOverride);
}
