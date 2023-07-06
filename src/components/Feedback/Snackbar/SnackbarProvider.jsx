import { nanoid } from 'nanoid';
import React from 'react';
import clsx from 'clsx';
import { createChainedFunction, mergeProps } from '@components/lib';
import { Portal } from '@components/utils';
import Snackbar from './Snackbar';
import SnackbarContainer, { componentClasses } from './SnackbarContainer';
import { SnackbarContext } from './SnackbarContext';

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

  const handleEnteredSnack = React.useCallback((node, isAppearing, key) => {
    setState((state) => ({
      ...state,
      snacks: state.snacks.map((item) =>
        item.id === key ? { ...item, entered: isAppearing } : item
      )
    }));
  }, []);

  const addSnackbar = React.useCallback(
    (messageOrOptions, optsOrUndefined = {}) => {
      if (messageOrOptions === undefined || messageOrOptions === null) {
        throw new Error('addSnackbar called with invalid argument');
      }

      const defaults = {
        maxSnack: 3,
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' }
      };

      const opts = isOptions(messageOrOptions) ? messageOrOptions : optsOrUndefined;

      const message = isOptions(messageOrOptions) ? messageOrOptions.message : messageOrOptions;

      const { key, preventDuplicate, ...options } = opts;

      const hasSpecifiedKey = !!key || key === 0;
      const id = hasSpecifiedKey ? key : nanoid();

      let merger = mergeProps(defaults, props);
      merger = mergeProps(merger, options);

      const snack = {
        id,
        ...options,
        message,
        open: true,
        entered: false,
        exited: false,
        action: merger.action,
        content: merger.content,
        severity: merger.severity,
        anchorOrigin: merger.anchorOrigin,
        disableWindowBlurListener: merger.disableWindowBlurListener,
        autoHideDuration: merger.autoHideDuration,
        hideIconVariant: merger.hideIconVariant,
        transition: merger.transition,
        transitionDuration: merger.transitionDuration,
        TransitionProps: merger.TransitionProps || true,
        iconVariant: merger.iconVariant || true,
        style: merger.style,
        SnackbarProps: merger.SnackbarProps || true,
        className: clsx(props.className, options.className),
        children: options.children || undefined
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
      <Portal disablePortal>
        {Object.keys(categ).map((origin) => {
          const [nomineeSnack] = categ[origin];
          return (
            <SnackbarContainer
              key={origin}
              dense={dense}
              anchorOrigin={nomineeSnack?.anchorOrigin}
              classes={classes}
            >
              {categ[origin].map((snack) => {
                const TransitionProps = {
                  onEnter: props.onEntered,
                  onEntering: props.onEntering,
                  onEntered: createChainedFunction([handleEnteredSnack, props.onEntered], snack.id),
                  onExit: props.onExit,
                  onExiting: props.onExiting,
                  onExited: createChainedFunction([handleExitedSnack, props.onExited], snack.id)
                };
                return (
                  <Snackbar
                    key={snack.id}
                    id={snack.id}
                    action={snack.action}
                    anchorOrigin={snack.anchorOrigin}
                    autoHideDuration={snack.autoHideDuration}
                    className={clsx(componentClasses.snackbar, snack.className)}
                    ClickAwayListenerProps={snack.ClickAwayListenerProps}
                    ContentProps={snack.ContentProps}
                    disableWindowBlurListener={snack.disableWindowBlurListener}
                    message={snack.message}
                    onClose={handleCloseSnack}
                    open={snack.open}
                    queue
                    transition={snack.transition}
                    TransitionProps={TransitionProps}
                    classes={classes}
                    style={snack.style}
                  >
                    {snack.children}
                  </Snackbar>
                );
              })}
            </SnackbarContainer>
          );
        })}
      </Portal>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
