import { forwardRef } from 'react';
import tw from 'twin.macro';
import { cn } from '@utils';
import { Paper } from '@components';

const appBarVariants = {
  root: tw`flex flex-col w-full box-border shrink-0 transition-colors`,
  color: {
    default: tw`bg-gray-500 dark:text-gray-100`,
    inherit: tw`text-inherit`,
    primary: tw`bg-primary-500 text-white`,
    secondary: tw`bg-secondary-500 text-white`,
    success: tw`bg-success-500 text-white`,
    warning: tw`bg-warning-500 text-white`,
    danger: tw`bg-danger-500 text-white`,
    transparent: tw`bg-transparent text-inherit`,
    monochrome: tw`border border-solid bg-white text-black border-black dark:bg-black dark:text-white dark:border-white`
  },
  position: {
    absolute: tw`absolute z-[100] top-0 left-auto right-0`,
    fixed: tw`fixed z-[100] top-0 left-auto right-0`,
    relative: tw`relative`,
    static: tw`static`,
    sticky: tw`sticky z-[100] top-0 left-auto right-0`
  }
};

const AppBar = forwardRef(
  ({ className, color = 'primary', position = 'fixed', ...other }, ref) => {
    const appBarStyles = [
      appBarVariants.root,
      appBarVariants.color[color],
      appBarVariants.position[position]
    ].filter(Boolean);

    return (
      <Paper
        square
        Component='header'
        elevation={['default', 'inherit', 'monochrome'].includes(color) ? 0 : 4}
        className={className}
        css={appBarStyles}
        ref={ref}
        {...other}
      />
    );
  }
);
AppBar.displayName = 'AppBar';

export default AppBar;
