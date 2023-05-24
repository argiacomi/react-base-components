import * as React from 'react';
import tw from 'twin.macro';

const skeletonVariantStyles = {
  root: tw`block bg-primary-light/[0.11] dark:bg-primary-dark/10 h-5`,
  variant: {
    text: tw`my-0 h-auto origin-[0_55%] scale-[1_.60] [&:empty:before]:content-["\\00a0"]`,
    circular: tw`rounded-full`,
    rounded: tw`rounded-[inherit]`
  },
  children: {
    root: tw`['& > *']:invisible`,
    width: tw`max-w-[fit-content]`,
    height: tw`h-auto`
  },
  animation: {
    pulse: tw`animate-pulse`,
    wave: tw`relative overflow-hidden [&::after]:(animate-skeleton-wave bg-gradient-to-r from-transparent via-primary-light/10 to-transparent content-[""] absolute translate-x-[-100%] bottom-0 left-0 right-0 top-0)`
  }
};

const DefaultComponent = 'span';

const Skeleton = React.forwardRef(
  (
    {
      animation = 'pulse',
      children,
      className,
      component = DefaultComponent,
      height,
      style,
      variant = 'text',
      width,
      ...other
    },
    ref
  ) => {
    const skeletonStyles = [
      skeletonVariantStyles.root,
      skeletonVariantStyles.variant?.[variant],
      Boolean(children) && skeletonVariantStyles.children.root,
      Boolean(children) && !width && skeletonVariantStyles.children.width,
      Boolean(children) && !height && skeletonVariantStyles.children.height,
      skeletonVariantStyles.animation?.[animation]
    ].filter(Boolean);

    return (
      <component
        ref={ref}
        className={className}
        css={skeletonStyles}
        {...other}
        style={{
          width,
          height,
          ...style
        }}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export default Skeleton;
