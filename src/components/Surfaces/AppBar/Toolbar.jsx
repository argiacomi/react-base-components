import { forwardRef } from 'react';
import tw from 'twin.macro';
import { cn } from '@utils';

const toolBarVariants = {
  root: tw`relative flex items-center min-h-[56px] landscape:min-h-[48px] px-6 lg:px-10 xl:px-20`,
  disableGutters: tw`px-0`,
  variant: {
    regular: tw`md:min-h-[64px]`,
    dense: tw`min-h-[48px]`
  }
};

const Toolbar = forwardRef(function Toolbar(props, ref) {
  const {
    className,
    Component = 'div',
    disableGutters = false,
    variant = 'regular',
    ...other
  } = props;

  const toolbarStyles = [
    toolBarVariants.root,
    disableGutters && toolBarVariants.disableGutters,
    toolBarVariants.variant[variant]
  ].filter(Boolean);

  return (
    <Component className={className} css={toolbarStyles} ref={ref} {...other} />
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
