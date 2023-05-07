import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';
import { Paper } from '@components';

const appBarVariants = cva(
  'flex flex-column w-full box-border shrink-0 transition-colors bg-white',
  {
    variants: {
      color: {
        default: 'bg-gray-100 dark:bg-gray-900 dark:text-gray-100',
        inherit: 'text-inherit',
        primary: 'bg-primary-500 text-white',
        secondary: 'bg-secondary-500 text-white',
        success: 'bg-success-500 text-white',
        warning: 'bg-warning-500 text-white',
        danger: 'bg-danger-500 text-white',
        transparent: 'bg-transparent text-inherit',
        monochrome:
          'bg-white text-black dark:border-black border border-solid dark:bg-black dark:text-white dark:border-white'
      },
      position: {
        absolute: 'absolute z-[100] top-0 left-auto right-0',
        fixed: 'fixed z-[100] top-0 left-auto right-0',
        relative: 'relative',
        static: 'static',
        sticky: 'sticky z-[100] top-0 left-auto right-0'
      }
    }
  }
);

const AppBar = forwardRef(
  ({ className, color = 'default', position = 'fixed', ...other }, ref) => {
    const classes = cn(appBarVariants({ color, position }), className);

    return (
      <Paper
        square
        Component='header'
        elevation={
          color === 'default' || color === 'inherit' || color === 'monochrome'
            ? 'elevation-0'
            : 'elevation-4'
        }
        className={classes}
        ref={ref}
        style={
          color === 'default' || color === 'inherit' || color === 'monochrome'
            ? { boxShadow: 'rgb(0 0 0 / 16%) 0 0 6px' }
            : {}
        }
        {...other}
      />
    );
  }
);
AppBar.displayName = 'AppBar';

export { AppBar, appBarVariants };
