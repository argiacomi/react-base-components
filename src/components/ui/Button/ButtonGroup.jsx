import {
  createContext,
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

export const ButtonGroupContext = createContext({});

const buttonGroupVariants = cva(
  'min-w-[40px] rounded-none active:scale-100 shadow-none',
  {
    variants: {
      variant: {
        contain: '',
        text: 'drop-shadow-md',
        outline: ''
      },
      orientation: {
        horizontal:
          'ml-[-1px] first-of-type:ml-0 first-of-type:rounded-l-md last-of-type:rounded-r-md',
        vertical:
          'mt-[-1px] first-of-type:mt-0 first-of-type:rounded-t-md last-of-type:rounded-b-md'
      },
      color: {
        inherit: 'border-gray-700',
        primary: 'border-primary-600',
        secondary: 'border-secondary-600',
        success: 'border-success-600',
        warning: 'border-warning-600',
        danger: 'border-danger-600',
        monochrome: 'border-gray-900'
      }
    },
    compoundVariants: [
      {
        variant: ['text', 'contain'],
        orientation: 'horizontal',
        className:
          'border-y-0 border-x border-solid first-of-type:border-l-0 last-of-type:border-r-0'
      },
      {
        variant: ['text', 'contain'],
        orientation: 'vertical',
        className:
          'border-x-0 border-y border-solid first-of-type:border-t-0 last-of-type:border-b-0'
      }
    ]
  }
);

const ButtonGroup = forwardRef(function ButtonGroup(props, ref) {
  const {
    children,
    className,
    color = 'primary',
    Component = 'div',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    disableRipple = false,
    fullWidth = false,
    orientation = 'horizontal',
    size = 'md',
    variant = 'outline',
    ...other
  } = props;

  const classes = buttonGroupVariants({ color, variant, orientation });

  const context = useMemo(
    () => ({
      className,
      classes,
      color,
      disabled,
      disableElevation,
      disableFocusRipple,
      disableRipple,
      fullWidth,
      orientation,
      size,
      variant
    }),
    [
      className,
      classes,
      color,
      disabled,
      disableElevation,
      disableFocusRipple,
      disableRipple,
      fullWidth,
      orientation,
      size,
      variant
    ]
  );

  return (
    <Component
      className={cn(
        'group inline-flex rounded-md',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        variant !== 'text' ? 'shadow-md' : '',
        disabled
          ? 'border-none bg-disabledLight shadow-none drop-shadow-none dark:bg-disabledDark'
          : '',
        disableElevation ? 'shadow-none drop-shadow-none' : '',
        fullWidth ? 'w-full' : ''
      )}
      ref={ref}
      {...other}
    >
      <ButtonGroupContext.Provider value={context}>
        {children}
      </ButtonGroupContext.Provider>
    </Component>
  );
});

export { ButtonGroup, buttonGroupVariants };
