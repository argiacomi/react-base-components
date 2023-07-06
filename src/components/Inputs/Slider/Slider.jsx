import * as React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp, useTheme } from '@styles';
import {
  capitalize,
  isHostComponent,
  shouldSpreadAdditionalProps,
  useSlotProps
} from '@components/lib';
import BaseValueLabel from './SliderValueLabel';
import useSlider, { valueToPercent } from './useSlider';

export const sliderClasses = {
  root: 'Slider-Root',
  rail: 'Slider-Rail',
  track: 'Slider-Track',
  thumb: 'Slider-Thumb',
  input: 'Slider-Input',
  mark: 'Slider-Mark',
  markActive: 'Slider-MarkActive',
  markLabel: 'Slider-MarkLabel',
  markLabelActive: 'Slider-MarkLabelActive',
  valueLabel: 'Slider-ValueLabel',
  valueLabelCircle: 'Slider-valueLabelCircle',
  valueLabelLabel: 'Slider-valueLabelLabel',
  valueLabelOpen: 'Slider-ValueLabelOpen',
  active: 'Active',
  disabled: 'Disabled',
  focusVisible: 'FocusVisible',
  dragging: 'Dragging',
  marked: 'Marked',
  vertical: 'Vertical',
  trackInverted: 'TrackInverted',
  trackFalse: 'TrackFalse'
};

function Identity(x) {
  return x;
}

export const SliderRoot = styled('span', {
  name: 'Slider',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  borderRadius: 100,
  boxSizing: 'content-box',
  display: 'inline-block',
  position: 'relative',
  cursor: 'pointer',
  touchAction: 'none',
  color: theme.color[ownerState.color].body,
  WebkitTapHighlightColor: 'transparent',
  ...(ownerState.orientation === 'horizontal' && {
    height: 4,
    width: '100%',
    padding: '18px 0',
    '@media (pointer: coarse)': {
      padding: '25px 0'
    },
    ...(ownerState.size === 'small' && {
      height: 2
    }),
    ...(ownerState.marked && {
      marginBottom: 20
    })
  }),
  ...(ownerState.orientation === 'vertical' && {
    height: '100%',
    width: 4,
    padding: '0 18px',
    '@media (pointer: coarse)': {
      padding: '0 25px'
    },
    ...(ownerState.size === 'small' && {
      width: 2
    }),
    ...(ownerState.marked && {
      marginRight: 44
    })
  }),
  '@media print': {
    colorAdjust: 'exact'
  },
  [`&.${sliderClasses.disabled}`]: {
    pointerEvents: 'none',
    cursor: 'default',
    color: theme.color.disabled.text
  },
  [`&.${sliderClasses.dragging}`]: {
    [`& .${sliderClasses.thumb}, & .${sliderClasses.track}`]: {
      transition: 'none'
    }
  },
  ...ownerState.cssStyles
}));

export const SliderRail = styled('span', {
  name: 'Slider',
  slot: 'Rail'
})(({ theme, ownerState }) => ({
  display: 'block',
  position: 'absolute',
  borderRadius: 'inherit',
  backgroundColor: 'currentColor',
  opacity: 0.38,
  ...(ownerState.orientation === 'horizontal' && {
    width: '100%',
    height: 'inherit',
    top: '50%',
    transform: 'translateY(-50%)'
  }),
  ...(ownerState.orientation === 'vertical' && {
    height: '100%',
    width: 'inherit',
    left: '50%',
    transform: 'translateX(-50%)'
  }),
  ...(ownerState.track === 'inverted' && {
    backgroundColor: ownerState.disabled ? theme.color.disabled.body : 'currentColor'
  })
}));

export const SliderTrack = styled('span', {
  name: 'Slider',
  slot: 'Track'
})(({ theme, ownerState }) => ({
  display: 'block',
  position: 'absolute',
  borderRadius: 'inherit',
  border: '1px solid currentColor',
  backgroundColor: 'currentColor',
  transition: theme.transition.create(['left', 'width', 'bottom', 'height'], {
    duration: theme.transition.duration.shortest
  }),
  ...(ownerState.orientation === 'horizontal' && {
    height: 'inherit',
    top: '50%',
    transform: 'translateY(-50%)'
  }),
  ...(ownerState.orientation === 'vertical' && {
    width: 'inherit',
    left: '50%',
    transform: 'translateX(-50%)'
  }),
  ...(ownerState.track === false && {
    display: 'none'
  }),
  ...(ownerState.track === 'inverted' && {
    backgroundColor:
      theme.color.mode === 'light'
        ? theme.alpha.lighten(theme.color[ownerState.color].body, 0.62)
        : theme.alpha.darken(theme.color[ownerState.color].body, 0.5)
  })
}));

export const SliderThumb = styled('span', {
  name: 'Slider',
  slot: 'Thumb'
})(({ theme, ownerState }) => ({
  position: 'absolute',
  width: 20,
  height: 20,
  boxSizing: 'border-box',
  borderRadius: 100,
  outline: 0,
  backgroundColor: 'currentColor',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: theme.transition.create(['box-shadow', 'left', 'bottom'], {
    duration: theme.transition.duration.shortest
  }),
  ...(ownerState.size === 'small' && {
    width: 12,
    height: 12
  }),
  ...(ownerState.orientation === 'horizontal' && {
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }),
  ...(ownerState.orientation === 'vertical' && {
    left: '50%',
    transform: 'translate(-50%, 50%)'
  }),
  '&:before': {
    position: 'absolute',
    content: '""',
    borderRadius: 'inherit',
    width: '100%',
    height: '100%',
    boxShadow: theme.boxShadow[2],
    ...(ownerState.size === 'small' && {
      boxShadow: 'none'
    })
  },
  '&::after': {
    position: 'absolute',
    content: '""',
    borderRadius: '50%',
    // 42px is the hit target
    width: 40,
    height: 40,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  [`&:hover, &.${sliderClasses.focusVisible}`]: {
    boxShadow: `0px 0px 0px 8px ${theme.alpha.add(theme.color[ownerState.color].body, 0.16)}`,
    '@media (hover: none)': {
      boxShadow: 'none'
    }
  },
  [`&.${sliderClasses.active}`]: {
    boxShadow: `0px 0px 0px 14px ${theme.alpha.add(theme.color[ownerState.color].body, 0.16)}`
  },
  [`&.${sliderClasses.disabled}`]: {
    '&:hover': {
      boxShadow: 'none'
    }
  }
}));

export const SliderMark = styled('span', {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'markActive',
  name: 'Slider',
  slot: 'Mark'
})(({ theme, ownerState, markActive }) => ({
  position: 'absolute',
  width: 2,
  height: 2,
  borderRadius: 100,
  backgroundColor: 'currentColor',
  opacity: 0.38,
  ...(ownerState.orientation === 'horizontal' && {
    top: '50%',
    transform: 'translate(-1px, -50%)'
  }),
  ...(ownerState.orientation === 'vertical' && {
    left: '50%',
    transform: 'translate(-50%, 1px)'
  }),
  ...(markActive && {
    backgroundColor: theme.color.background,
    opacity: 0.8
  })
}));

const SliderValueLabel = styled(BaseValueLabel, {
  name: 'Slider',
  slot: 'ValueLabel'
})(({ theme, ownerState }) => ({
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  ...theme.text.size.sm,
  ...(ownerState.size === 'small' && {
    width: 24,
    height: 24,
    ...theme.text.size.xs
  }),
  borderRadius: '50% 50% 50% 0',
  whiteSpace: 'nowrap',
  minWidth: '24px',
  fontWeight: theme.text.weight.medium,
  backgroundColor: theme.color[ownerState.color].body,
  color: '#fff',
  ...(ownerState.disabled && {
    backgroundColor: theme.color.disabled.body,
    color: theme.color.disabled.text
  }),
  boxShadow: theme.boxShadow[2],
  transition: theme.transition.create(['transform'], {
    duration: theme.transition.duration.shortest
  }),
  transform:
    'translateY(calc((var(--Slider-thumbSize) + var(--Slider-valueLabelArrowSize)) * -1)) scale(0)',
  ...(ownerState.orientation === 'horizontal' && {
    top: ownerState.size === 'small' ? -32 : -36,
    [`&.${sliderClasses.valueLabel}`]: {
      transform: 'translateY(50%) rotate(-45deg) scale(0)'
    },
    [`& .${sliderClasses.valueLabelCircle}`]: {
      transform: 'rotate(45deg)'
    },
    [`&.${sliderClasses.valueLabelOpen}`]: {
      transform: 'translateY(0) rotate(-45deg) scale(1)'
    }
  }),
  ...(ownerState.orientation === 'vertical' && {
    left: ownerState.size === 'small' ? -32 : -36,
    [`&.${sliderClasses.valueLabel}`]: {
      transform: 'translateX(50%) rotate(225deg) scale(0)'
    },
    [`& .${sliderClasses.valueLabelCircle}`]: {
      transform: 'rotate(-225deg)'
    },
    [`&.${sliderClasses.valueLabelOpen}`]: {
      transform: 'translateX(0) rotate(225deg) scale(1)'
    }
  })
}));

export const SliderMarkLabel = styled('span', {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'markLabelActive',
  name: 'Slider',
  slot: 'MarkLabel'
})(({ theme, ownerState, markLabelActive }) => ({
  ...theme.text.size.sm,
  ...(ownerState.size === 'small' && theme.text.size.xs),
  fontWeight: theme.text.weight.medium,
  color: theme.color.text.secondary,
  position: 'absolute',
  whiteSpace: 'nowrap',
  ...(ownerState.orientation === 'horizontal' && {
    top: 36,
    transform: 'translateX(-50%)',
    '@media (pointer: coarse)': {
      top: 44
    }
  }),
  ...(ownerState.orientation === 'vertical' && {
    left: 36,
    transform: 'translateY(50%)',
    '@media (pointer: coarse)': {
      left: 44
    }
  }),
  ...(markLabelActive && {
    color: theme.color.text.primary
  })
}));

const SliderInput = styled('input', {
  name: 'Slider',
  slot: 'Input'
})({});

const Slider = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const {
    'aria-label': ariaLabel,
    'aria-valuetext': ariaValuetext,
    'aria-labelledby': ariaLabelledby,
    component = 'span',
    color = 'primary',
    classes: classesProp,
    className,
    disableSwap = false,
    disabled = false,
    getAriaLabel,
    getAriaValueText,
    marks: marksProp = false,
    max = 100,
    min = 0,
    name,
    onChange,
    onChangeCommitted,
    orientation = 'horizontal',
    size = 'medium',
    step = 1,
    scale = Identity,
    slotProps,
    slots,
    tabIndex,
    track = 'normal',
    value: valueProp,
    valueLabelDisplay = 'off',
    valueLabelFormat = Identity,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    isRtl,
    max,
    min,
    classes: classesProp,
    disabled,
    disableSwap,
    orientation,
    marks: marksProp,
    color,
    size,
    step,
    scale,
    track,
    valueLabelDisplay,
    valueLabelFormat
  };

  const {
    axisProps,
    getRootProps,
    getHiddenInputProps,
    getThumbProps,
    open,
    active,
    axis,
    focusedThumbIndex,
    range,
    dragging,
    marks,
    values,
    trackOffset,
    trackLeap,
    getThumbStyle
  } = useSlider({ ...ownerState, rootRef: ref });

  ownerState.marked = marks.length > 0 && marks.some((mark) => mark.label);
  ownerState.dragging = dragging;
  ownerState.focusedThumbIndex = focusedThumbIndex;

  const classes = {
    root: [
      sliderClasses.root,
      ownerState.disabled && sliderClasses.disabled,
      ownerState.dragging && sliderClasses.dragging,
      ownerState.marked && sliderClasses.marked,
      ownerState.orientation === 'vertical' && sliderClasses.vertical,
      ownerState.track === 'inverted' && sliderClasses.trackInverted,
      ownerState.track === false && sliderClasses.trackFalse,
      ownerState.color && `Color${capitalize(color)}`,
      ownerState.size && `Size${capitalize(size)}`
    ],
    rail: [sliderClasses.rail],
    track: [sliderClasses.track],
    thumb: [
      sliderClasses.thumb,
      ownerState.disabled && sliderClasses.disabled,
      ownerState.size && `ThumbSize${capitalize(size)}`,
      ownerState.color && `ThumbColor${capitalize(color)}`
    ],
    input: sliderClasses.input,
    mark: [sliderClasses.mark],
    markActive: [sliderClasses.markActive],
    markLabel: [sliderClasses.markLabel],
    markLabelActive: [sliderClasses.markLabelActive],
    valueLabel: [sliderClasses.valueLabel],
    valueLabelOpen: [sliderClasses.valueLabelOpen],
    active: [sliderClasses.active],
    focusVisible: [sliderClasses.focusVisible]
  };

  const RootSlot = slots?.root ?? SliderRoot;
  const RailSlot = slots?.rail ?? SliderRail;
  const TrackSlot = slots?.track ?? SliderTrack;
  const ThumbSlot = slots?.thumb ?? SliderThumb;
  const ValueLabelSlot = slots?.valueLabel ?? SliderValueLabel;
  const MarkSlot = slots?.mark ?? SliderMark;
  const MarkLabelSlot = slots?.markLabel ?? SliderMarkLabel;
  const InputSlot = slots?.input ?? SliderInput;

  const rootProps = useSlotProps({
    elementType: RootSlot,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ...(shouldSpreadAdditionalProps(RootSlot) && {
        as: component
      })
    },
    ownerState: {
      ...ownerState,
      ...slotProps?.root?.ownerState
    },
    className: [classes.root, className]
  });

  const railProps = useSlotProps({
    elementType: RailSlot,
    externalSlotProps: slotProps?.rail,
    ownerState,
    className: classes.rail
  });

  const trackProps = useSlotProps({
    elementType: TrackSlot,
    externalSlotProps: slotProps?.track,
    additionalProps: {
      style: {
        ...axisProps[axis].offset(trackOffset),
        ...axisProps[axis].leap(trackLeap)
      }
    },
    ownerState: {
      ...ownerState,
      ...slotProps?.track?.ownerState
    },
    className: classes.track
  });

  const thumbProps = useSlotProps({
    elementType: ThumbSlot,
    getSlotProps: getThumbProps,
    externalSlotProps: slotProps?.thumb,
    ownerState: {
      ...ownerState,
      ...slotProps?.thumb?.ownerState
    },
    className: classes.thumb
  });

  const inputProps = useSlotProps({
    elementType: InputSlot,
    getSlotProps: getHiddenInputProps,
    externalSlotProps: slotProps?.input,
    ownerState
  });

  const valueLabelProps = useSlotProps({
    elementType: ValueLabelSlot,
    externalSlotProps: slotProps?.valueLabel,
    ownerState: {
      ...ownerState,
      ...slotProps?.valueLabel?.ownerState
    },
    className: classes.valueLabel
  });

  const markProps = useSlotProps({
    elementType: MarkSlot,
    externalSlotProps: slotProps?.mark,
    ownerState,
    className: classes.mark
  });

  const markLabelProps = useSlotProps({
    elementType: MarkLabelSlot,
    externalSlotProps: slotProps?.markLabel,
    ownerState,
    className: classes.markLabel
  });

  return (
    <RootSlot {...rootProps}>
      <RailSlot {...railProps} />
      <TrackSlot {...trackProps} />
      {marks
        .filter((mark) => mark.value >= min && mark.value <= max)
        .map((mark, index) => {
          const percent = valueToPercent(mark.value, min, max);
          const style = axisProps[axis].offset(percent);

          let markActive;
          if (track === false) {
            markActive = values.indexOf(mark.value) !== -1;
          } else {
            markActive =
              (track === 'normal' &&
                (range
                  ? mark.value >= values[0] && mark.value <= values[values.length - 1]
                  : mark.value <= values[0])) ||
              (track === 'inverted' &&
                (range
                  ? mark.value <= values[0] || mark.value >= values[values.length - 1]
                  : mark.value >= values[0]));
          }

          return (
            <React.Fragment key={index}>
              <MarkSlot
                data-index={index}
                {...markProps}
                {...(!isHostComponent(MarkSlot) && {
                  markActive
                })}
                style={{ ...style, ...markProps.style }}
                className={clsx(markProps.className, {
                  [classes.markActive]: markActive
                })}
              />
              {mark.label != null ? (
                <MarkLabelSlot
                  aria-hidden
                  data-index={index}
                  {...markLabelProps}
                  {...(!isHostComponent(MarkLabelSlot) && {
                    markLabelActive: markActive
                  })}
                  style={{ ...style, ...markLabelProps.style }}
                  className={clsx(classes.markLabel, markLabelProps.className, {
                    [classes.markLabelActive]: markActive
                  })}
                >
                  {mark.label}
                </MarkLabelSlot>
              ) : null}
            </React.Fragment>
          );
        })}
      {values.map((value, index) => {
        const percent = valueToPercent(value, min, max);
        const style = axisProps[axis].offset(percent);
        return (
          <ThumbSlot
            key={index}
            data-index={index}
            {...thumbProps}
            className={clsx(thumbProps.className, {
              [classes.active]: active === index,
              [classes.focusVisible]: focusedThumbIndex === index
            })}
            style={{
              ...style,
              ...getThumbStyle(index),
              ...thumbProps.style
            }}
          >
            <InputSlot
              data-index={index}
              aria-label={getAriaLabel ? getAriaLabel(index) : ariaLabel}
              aria-valuenow={scale(value)}
              aria-valuetext={
                getAriaValueText ? getAriaValueText(scale(value), index) : ariaValuetext
              }
              value={values[index]}
              {...inputProps}
            />
            {valueLabelDisplay !== 'off' ? (
              <ValueLabelSlot
                {...valueLabelProps}
                className={clsx(
                  valueLabelProps.className,
                  (open === index || active === index || valueLabelDisplay === 'on') &&
                    classes.valueLabelOpen
                )}
                open={open === index}
                {...(!isHostComponent(ValueLabelSlot) && {
                  value:
                    typeof valueLabelFormat === 'function'
                      ? valueLabelFormat(scale(value), index)
                      : valueLabelFormat,
                  index,
                  disabled
                })}
              >
                {typeof valueLabelFormat === 'function'
                  ? valueLabelFormat(scale(value), index)
                  : valueLabelFormat}
              </ValueLabelSlot>
            ) : null}
          </ThumbSlot>
        );
      })}
    </RootSlot>
  );
});

Slider.displayName = 'Slider';

export default Slider;
