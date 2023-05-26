import * as React from 'react';
import { usePreviousProps } from '@component-hooks';
import tw from 'twin.macro';

const badgeRootStyles = tw`relative inline-flex align-middle shrink-0`;

const badgeStyleVariants = {
  root: tw`flex flex-row flex-wrap justify-center content-center items-center absolute box-border font-medium min-w-[20px] min-h-[20px] px-[6px] rounded-[10px] z-10 transition-transform duration-[225] ease-in-out`,
  color: {
    primary: tw`bg-primary-500 text-white`,
    secondary: tw`bg-secondary-500 text-white`,
    success: tw`bg-success-500 text-white`,
    warning: tw`bg-warning-500 text-white`,
    danger: tw`bg-danger-500 text-white`
  },
  dot: tw`rounded-[4px] h-[8px] w-[8px] p-0`,
  invisilbe: tw`scale-0`
};

const getPosition = (vertical, horizontal) => {
  let position = {};
  position[vertical] = vertical === 'bottom' ? 0 : '14%';
  position[horizontal] = horizontal === 'right' ? 0 : '14%';
  return position;
};

const getTransform = (vertical, horizontal) => {
  const sign = {
    vertical: vertical === 'bottom' ? 1 : -1,
    horizontal: horizontal === 'right' ? 1 : -1
  };
  return `scale(1) translate(${sign.horizontal * 50}%, ${sign.vertical * 50}%)`;
};

const getTransformOrigin = (vertical, horizontal) => {
  return `${horizontal === 'right' ? '100%' : '0%'} ${
    vertical === 'bottom' ? '100%' : '0%'
  }`;
};

const useBadge = (parameters) => {
  const {
    badgeContent: badgeContentProp,
    invisible: invisibleProp = false,
    max: maxProp = 99,
    showZero = false
  } = parameters;

  const prevProps = usePreviousProps({
    badgeContent: badgeContentProp,
    max: maxProp
  });

  let invisible = invisibleProp;

  if (invisibleProp === false && badgeContentProp === 0 && !showZero) {
    invisible = true;
  }

  const { badgeContent, max = maxProp } = invisible ? prevProps : parameters;

  const displayValue =
    badgeContent && Number(badgeContent) > max ? `${max}+` : badgeContent;

  return {
    badgeContent,
    invisible,
    max,
    displayValue
  };
};

const Badge = React.forwardRef((props, ref) => {
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: 'top',
      horizontal: 'right'
    },
    className,
    classes: classesProp,
    component,
    components = {},
    componentsProps = {},
    children,
    overlap: overlapProp = 'rectangular',
    color: colorProp = 'default',
    invisible: invisibleProp = false,
    max: maxProp = 99,
    badgeContent: badgeContentProp,
    slots = {},
    slotProps = {},
    showZero = false,
    variant: variantProp = 'standard',
    ...other
  } = props;

  const { badgeContent, max, displayValue, invisible } = useBadge({
    ...props,
    max: maxProp
  });

  const Root = slots.root ?? 'span';
  const rootProps = {
    Root,
    ...slotProps.root,
    ...other,
    ref
  };

  const BadgeComponent = slots.badge ?? 'span';
  const badgeProps = {
    elementType: BadgeComponent,
    ...slotProps.badge
  };

  const position = getPosition(
    anchorOriginProp.vertical,
    anchorOriginProp.horizontal
  );
  const transform = getTransform(
    anchorOriginProp.vertical,
    anchorOriginProp.horizontal
  );
  const transformOrigin = getTransformOrigin(
    anchorOriginProp.vertical,
    anchorOriginProp.horizontal
  );

  const badgeStyle = [
    badgeStyleVariants.root,
    badgeStyleVariants.color[colorProp],
    badgeStyleVariants[variantProp],
    position,
    transform,
    transformOrigin,
    invisible && badgeStyleVariants[invisible]
  ].filter(Boolean);

  console.log(badgeStyle);

  return (
    <Root css={badgeRootStyles}>
      {children}
      <BadgeComponent css={badgeStyle}>{displayValue}</BadgeComponent>
    </Root>
  );
});

Badge.displayName = 'Badge';

export default Badge;
