import React from 'react';
import clsx from 'clsx';
import styled from '@styles';

export const PopperArrowRoot = styled('div')(({ theme, ownerState }) => {
  if (!ownerState.disabled) {
    const unitWidth = ownerState.width / 2;
    const innerRadius = Number.parseFloat(theme.rounded.sm) * ownerState.width;
    const outerRadius = Number.parseFloat(theme.rounded.base) * ownerState.width;

    const ax = 0;
    const ay = unitWidth;
    const bx = (outerRadius * 1) / Math.sqrt(2);
    const by = unitWidth - outerRadius * (1 - 1 / Math.sqrt(2));
    const cx = unitWidth - innerRadius * (1 / Math.sqrt(2));
    const cy = outerRadius * (Math.sqrt(2) - 1) + innerRadius * (1 / Math.sqrt(2));
    const dx = 2 * unitWidth - cx;
    const dy = cy;
    const ex = 2 * unitWidth - bx;
    const ey = by;
    const fx = 2 * unitWidth - ax;
    const fy = ay;

    const polygonOffset = outerRadius * (Math.sqrt(2) - 1);

    return {
      position: ownerState.position,
      zIndex: '1 ',
      display: 'block',
      pointerEvents: 'none',
      width: ownerState.width,
      height: ownerState.width,
      overflow: 'hidden',
      '&::before': {
        position: 'absolute',
        bottom: 0,
        insetInlineStart: 0,
        width: ownerState.width,
        height: ownerState.width / 2,
        backgroundColor: 'var(--popper-arrow-bg)',
        boxShadow: ownerState.elevation > 3 ? theme.boxShadow[ownerState.elevation] : null,
        filter: ownerState.elevation <= 3 ? theme.dropShadow[ownerState.elevation] : null,
        clipPath: `path('M ${ax} ${ay} A ${outerRadius} ${outerRadius} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${innerRadius} ${innerRadius} 0 0 1 ${dx} ${dy} L ${ex} ${ey} A ${outerRadius} ${outerRadius} 0 0 0 ${fx} ${fy} Z')`,
        ...(ownerState.square && {
          clipPath: `polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${
            2 * unitWidth - polygonOffset
          }px 100%, ${polygonOffset}px 100%)`
        }),
        ...(theme.color.mode === 'dark' && {
          backgroundImage: `linear-gradient(${theme.alpha.add(
            theme.color.white,
            theme.alpha.overlay([ownerState.elevation])
          )},${theme.alpha.add(theme.color.white, theme.alpha.overlay(ownerState.elevation))})`
        }),
        content: '""',
        zIndex: '1 '
      },
      ['&::after']: {
        position: 'absolute',
        bottom: 0,
        insetInlineStart: 0,
        width: ownerState.width,
        border: `${ownerState.width / 4 + 0.5}px solid`,
        borderColor: 'var(--popper-arrow-border-color)',
        boxShadow: ownerState.elevation > 3 ? theme.boxShadow[ownerState.elevation] : null,
        filter: ownerState.elevation <= 3 ? theme.dropShadow[ownerState.elevation] : null,
        clipPath: `path('M ${ax} ${ay} A ${outerRadius} ${outerRadius} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${innerRadius} ${innerRadius} 0 0 1 ${dx} ${dy} L ${ex} ${ey} A ${outerRadius} ${outerRadius} 0 0 0 ${fx} ${fy} Z')`,
        ...(ownerState.square && {
          clipPath: `polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${
            2 * unitWidth - polygonOffset
          }px 100%, ${polygonOffset}px 100%)`
        }),
        content: '""',
        zIndex: '-10 '
      }
    };
  }
});

const PopperArrow = React.forwardRef((props, ref) => {
  const {
    arrowId: id,
    className,
    component = 'div',
    disableArrow: disabled = false,
    elevation = 3,
    outlined = false,
    position,
    square = false,
    width,
    ...other
  } = props;

  const ownerState = { ...props, disabled, elevation, outlined, position, square, width };

  return (
    <PopperArrowRoot
      as={component}
      id={id}
      className={clsx('PopperArrow-Root', className)}
      ownerState={ownerState}
      {...other}
      ref={ref}
      style={{
        ...other.style
      }}
    />
  );
});
PopperArrow.displayName = 'PopperArrow';

export default PopperArrow;
