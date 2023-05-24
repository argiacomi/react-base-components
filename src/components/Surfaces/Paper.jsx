import { forwardRef } from 'react';
import tw from 'twin.macro';

const elevationClass = [
  tw`shadow-none drop-shadow-none dark:bg-white/0`,
  tw`drop-shadow-sm dark:bg-white/5`,
  tw`drop-shadow dark:bg-white/[.06]`,
  tw`drop-shadow-md dark:bg-white/[.09]`,
  tw`drop-shadow-lg dark:bg-white/[.12]`,
  tw`drop-shadow-xl dark:bg-white/[.15]`,
  tw`drop-shadow-2xl dark:bg-white/[.16]`
];

const Paper = forwardRef(
  (
    {
      className,
      Component = 'div',
      elevation = 2,
      square = false,
      outline = false,
      ...otherProps
    },
    ref
  ) => {
    const paperStyles = [
      tw`rounded-md`,
      !outline && elevationClass[elevation],
      square && tw`rounded-none`,
      outline &&
        tw`border-[1px] border-solid shadow-none border-disabled-light dark:border-disabled-dark`
    ].filter(Boolean);

    return (
      <Component
        className={className}
        css={paperStyles}
        ref={ref}
        {...otherProps}
      />
    );
  }
);

Paper.displayName = 'Paper';

export default Paper;
