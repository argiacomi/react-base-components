import * as React from 'react';
import tw from 'twin.macro';

const dividerStyles = {
  root: tw`m-0 shrink-0 border-solid border-0 border-b border-dividerLight dark:border-dividerDark `,
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
  before: tw`before:self-center before:relative before:w-full before:h-0 before:border-0 before:border-t before:border-solid before:border-dividerLight dark:before:border-dividerDark before:content-[""]`,
  after: tw`after:self-center after:relative after:w-full after:h-0 after:border-0 after:border-t after:border-solid after:border-dividerLight dark:after:border-dividerDark after:content-[""]`,
  vertical: {
    root: tw`flex-col`,
    before: tw`before:self-center before:static before:h-full before:w-0 before:border-t-0 before:border-l before:border-solid before:border-l-dividerLight dark:before:border-l-dividerDark`,
    after: tw`after:self-center after:static after:h-full after:w-0 after:border-t-0 after:border-l after:border-solid after:border-l-dividerLight dark:after:border-l-dividerDark`
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
