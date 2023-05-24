import * as React from 'react';
import tw from 'twin.macro';

const dividerStyles = {
  root: tw`m-0 shrink-0 border-solid border-0 border-b border-disabled-light dark:border-disabled-dark `,
  absolute: tw`absolute bottom-0 left-0 w-full`,
  inset: tw`ml-[72px]`,
  middle: {
    horizontal: tw`ml-4 mr-4`,
    vertical: tw`mt-2 mb-2`
  },
  vertical: tw`h-full border-b-0 border-r`,
  right: tw`before:w-[90%] after:w-[10%]`,
  left: tw`before:w-[10%] after:w-[90%]`,
  flexItem: tw`self-stretch h-auto`
};

const childStyles = {
  root: tw`flex whitespace-nowrap text-center border-0`,
  before: tw`before:(self-center relative w-full h-0 border-0 border-t border-solid border-disabled-light dark:border-disabled-dark content-[""])`,
  after: tw`after:(self-center relative w-full h-0 border-0 border-t border-solid border-disabled-light dark:border-disabled-dark content-[""])`,
  vertical: {
    root: tw`flex-col`,
    before: tw`before:(self-center static h-full w-0 border-t-0 border-l border-solid border-l-disabled-light dark:border-l-disabled-dark)`,
    after: tw`after:(self-center static h-full w-0 border-t-0 border-l border-solid border-l-disabled-light dark:border-l-disabled-dark)`
  }
};

const wrapperStyles = {
  root: tw`inline-block pl-2 pr-2`,
  vertical: tw`pt-2 pb-2`
};

const Divider = React.forwardRef(
  (
    {
      absolute = false,
      children,
      className,
      component,
      flexItem = false,
      orientation = 'horizontal',
      textAlign = 'center',
      variant = 'fullWidth',
      ...other
    },
    ref
  ) => {
    const DividerRoot = children ? 'div' : 'hr';
    const DividerWrapper = 'span';

    const role = DividerRoot !== 'hr' ? 'separator' : undefined;

    const classes = {
      root: [
        dividerStyles.root,
        absolute && dividerStyles.absolute,
        dividerStyles[variant],
        variant !== 'fullWidth' && dividerStyles[variant][orientation],
        orientation === 'vertical' && dividerStyles[orientation],
        flexItem && dividerStyles.flexItem,
        children && childStyles.root,
        children && childStyles.before,
        children && childStyles.after,
        children && orientation === 'vertical' && childStyles[orientation].root,
        children &&
          orientation === 'vertical' &&
          childStyles[orientation].before,
        children &&
          orientation === 'vertical' &&
          childStyles[orientation].after,
        orientation !== 'vertical' && dividerStyles[textAlign]
      ].filter(Boolean),
      wrapper: [wrapperStyles.root, wrapperStyles[orientation]].filter(Boolean)
    };

    return (
      <DividerRoot
        as={component}
        className={className}
        css={classes.root}
        role={role}
        ref={ref}
        {...other}
      >
        {children ? (
          <DividerWrapper css={classes.wrapper}>{children}</DividerWrapper>
        ) : null}
      </DividerRoot>
    );
  }
);
Divider.displayName = 'Divider';

export default Divider;
