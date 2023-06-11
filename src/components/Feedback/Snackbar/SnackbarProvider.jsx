import React from 'react';
import { mergeProps } from '@components/lib';
import { Portal } from '@components/utils';
import clsx from 'clsx';
import { SnackbarContext } from './SnackbarContext';
import Snackbar from './Snackbar';
import SnackbarContainer from './SnackbarContainer';

const isOptions = (messageOrOptions) => {
  const isMessage = typeof messageOrOptions === 'string' || React.isValidElement(messageOrOptions);
  return !isMessage;
};

const SnackbarProvider = (props) => {
  const { maxSnack = 3, dense = false, classes } = props;

  const [state, setState] = React.useState({
    snacks: [],
    queue: []
  });

  const processQueue = React.useCallback((state) => {
    const { queue, snacks } = state;
    if (queue.length > 0) {
      return {
        ...state,
        snacks: [...snacks, queue[0]],
        queue: queue.slice(1, queue.length)
      };
    }
    return state;
  }, []);

  const handleDismissOldest = React.useCallback(
    (state) => {
      if (state.snacks.some((item) => !item.open || item.requestClose)) {
        return state;
      }

      let popped = false;
      let ignore = false;

      const persistentCount = state.snacks.reduce(
        (acc, current) => acc + (current.open && current.persist ? 1 : 0),
        0
      );

      if (persistentCount === maxSnack) {
        ignore = true;
      }

      const snacks = state.snacks.map((item) => {
        if (!popped && (!item.persist || ignore)) {
          popped = true;

          if (!item.entered) {
            return {
              ...item,
              requestClose: true
            };
          }

          if (item.onClose) {
            item.onClose(null, 'maxsnack', item.id);
          }

          if (props.onClose) {
            props.onClose(null, 'maxsnack', item.id);
          }

          return {
            ...item,
            open: false
          };
        }

        return { ...item };
      });

      return { ...state, snacks };
    },
    [maxSnack, props]
  );

  const handleDisplaySnack = React.useCallback(
    (state) => {
      const { snacks } = state;
      if (snacks.length >= maxSnack) {
        return handleDismissOldest(state);
      }
      return processQueue(state);
    },
    [handleDismissOldest, maxSnack, processQueue]
  );

  const addSnackbar = React.useCallback(
    (messageOrOptions, optsOrUndefined = {}) => {
      if (messageOrOptions === undefined || messageOrOptions === null) {
        throw new Error('addSnackbar called with invalid argument');
      }

      const defaults = {
        maxSnack: 3,
        persist: false,
        hideIconVariant: false,
        disableWindowBlurListener: false,
        variant: 'default',
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        TransitionComponent: 'Slide',
        transitionDuration: {
          enter: 225,
          exit: 195
        }
      };

      const opts = isOptions(messageOrOptions) ? messageOrOptions : optsOrUndefined;

      const message = isOptions(messageOrOptions) ? messageOrOptions.message : messageOrOptions;

      const { key, preventDuplicate, ...options } = opts;

      const hasSpecifiedKey = !!key || key === 0;
      const id = hasSpecifiedKey ? key : new Date().getTime() + Math.random();

      let merger = mergeProps(defaults, props);
      merger = mergeProps(merger, options);

      const snack = {
        id,
        ...options,
        message,
        open: true,
        entered: false,
        requestClose: false,
        persist: merger.persist,
        action: merger.action,
        content: merger.content,
        variant: merger.variant,
        anchorOrigin: merger.anchorOrigin,
        disableWindowBlurListener: merger.disableWindowBlurListener,
        autoHideDuration: merger.autoHideDuration,
        hideIconVariant: merger.hideIconVariant,
        TransitionComponent: merger.TransitionComponent,
        transitionDuration: merger.transitionDuration,
        TransitionProps: merger.TransitionProps || true,
        iconVariant: merger.iconVariant || true,
        style: merger.style || true,
        SnackbarProps: merger.SnackbarProps || true,
        className: clsx(props.className, options.className)
      };

      if (snack.persist) {
        snack.autoHideDuration = undefined;
      }

      setState((state) => {
        if ((preventDuplicate === undefined && props.preventDuplicate) || preventDuplicate) {
          const compareFunction = (item) =>
            hasSpecifiedKey ? item.id === id : item.message === message;

          const inQueue = state.queue.findIndex(compareFunction) > -1;
          const inView = state.snacks.findIndex(compareFunction) > -1;
          if (inQueue || inView) {
            return state;
          }
        }

        return handleDisplaySnack({
          ...state,
          queue: [...state.queue, snack]
        });
      });

      return id;
    },
    [handleDisplaySnack, props]
  );

  const handleCloseSnack = React.useCallback(
    (event, reason, key) => {
      if (props.onClose) {
        props.onClose(event, reason, key);
      }

      const shouldCloseAll = key === undefined;

      setState(({ snacks, queue }) => ({
        snacks: snacks.map((item) => {
          if (!shouldCloseAll && item.id !== key) {
            return { ...item };
          }

          return item.entered ? { ...item, open: false } : { ...item, requestClose: true };
        }),
        queue: queue.filter((item) => item.id !== key)
      }));
    },
    [props]
  );

  const closeSnackbar = React.useCallback(
    (key) => {
      const toBeClosed = state.snacks.find((item) => item.id === key);
      if ((!!key || key === 0) && toBeClosed && toBeClosed.onClose) {
        toBeClosed.onClose(null, 'instructed', key);
      }

      handleCloseSnack(null, 'instructed', key);
    },
    [handleCloseSnack, state.snacks]
  );

  const handleExitedSnack = React.useCallback(
    (node, key) => {
      if (!(!!key || key === 0)) {
        throw new Error('handleExitedSnack Cannot be called with undefined key');
      }

      setState((state) => {
        const newState = processQueue({
          ...state,
          snacks: state.snacks.filter((item) => item.id !== key)
        });

        if (newState.queue.length === 0) {
          return newState;
        }

        return handleDismissOldest(newState);
      });
    },
    [handleDismissOldest, processQueue]
  );

  const handleEnteredSnack = React.useCallback((node, key) => {
    setState((state) => ({
      ...state,
      snacks: state.snacks.map((item) => (item.id === key ? { ...item, entered: true } : item))
    }));
  }, []);

  const categ = state.snacks.reduce((acc, current) => {
    const category = `${current.anchorOrigin.vertical}${current.anchorOrigin.horizontal}`;
    const existingOfCategory = acc[category] || [];
    return {
      ...acc,
      [category]: [...existingOfCategory, current]
    };
  }, {});

  return (
    <SnackbarContext.Provider value={{ addSnackbar, closeSnackbar }}>
      {props.children}
      <Portal>
        {Object.keys(categ).map((origin) => {
          const [nomineeSnack] = categ[origin];
          <SnackbarContainer
            key={origin}
            dense={dense}
            anchorOrigin={nomineeSnack?.anchorOrigin}
            classes={classes}
          >
            {categ[origin].map((snack) => (
              <Snackbar
                key={snack.id}
                classes={classes}
                onClose={handleCloseSnack}
                onEnter={props.onEnter}
                onExit={props.onExit}
                onExited={handleExitedSnack}
                onEntered={handleEnteredSnack}
                {...snack}
              />
            ))}
          </SnackbarContainer>;
        })}
      </Portal>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
