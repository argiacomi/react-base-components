import { forwardRef, useContext } from 'react';
import TableContext from './TableContext';
import Tablelvl2Context from './Tablelvl2Context';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';

const cellVariants = cva('', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
      inherit: ''
    },
    padding: {
      none: 'p-0',
      default: 'p-4',
      dense: 'px-4 py-2'
    },
    size: {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    }
  }
});

const TableCell = forwardRef(
  (
    {
      align = 'inherit',
      className,
      component,
      padding = 'default',
      scope,
      size = 'medium',
      sortDirection = false,
      variant,
      ...other
    },
    ref
  ) => {
    const tableContext = useContext(TableContext);
    const tablelvl2Context = useContext(Tablelvl2Context);

    const Component =
      component || (tablelvl2Context.variant === 'head' ? 'th' : 'td');
    const resolvedPadding = padding || tableContext.padding || 'default';
    const resolvedSize = size || tableContext.size || 'md';
    const resolvedVariant = variant || tablelvl2Context.variant;

    return (
      <Component
        ref={ref}
        className={cn(
          cellVariants({
            align,
            padding: resolvedPadding,
            size: resolvedSize,
            className
          })
        )}
        scope={resolvedVariant === 'head' ? scope : undefined}
        {...other}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

export default TableCell;
