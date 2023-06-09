## Popper

A React component that provides a customizable popper. It is built using the following sub-components:

- Popper
- BasePopper
- Portal
- PopperTooltip
- PopperContent
- PopperArrow

### Usage

Import Statement

```javascript
import Popper from './Popper';
```

Component Usage

```javascript
<Popper
  anchorEl={anchorEl}
  component={component}
  slots={slots}
  slotProps={slotProps}
  container={container}
  popperOptions={popperOptions}
  popperRef={popperRef}
  disableArrow
  disablePortal
  keepMounted
  open
  transition
  {...other}
/>
```

### Props

**anchorEl**

- The DOM element that the popper popper should be positioned relative to.

**component**

- The root element to be rendered for the popper.
- Default is `div`

**slots**

- An object containing sub-components to be rendered.
- Default is `{}`

**slotProps**

- An object containing props for the sub-components.
- Default is `{}`

**container**

- The DOM element that the popper popper should be appended to.
- Default is `root`

**disableArrow**

- A boolean to disable the addition of an arrow to the popper.
- Default is `false`

**disablePortal**

- A boolean to disable the usage of a portal.
- Default is `false`

**keepMounted**

- A boolean to keep the popper mounted in the DOM when closed.
- Default is `false`

**open**

- A boolean to control whether the popper is visible.
- Default is `false`

**popperOptions**

- An object containing numerous options for the positioning and the behavior of the popper.
- Default values as well as available options, specified below.

**popperRef**

- A ref object to access the popper instance.

**transition**

- A prop to enable or disable transitions.
- The prop can either be a Boolean or a string specifying a transition type. Default is `false`
- Options:

```javascript
  true,
  false,
  'Fade',
  'Grow',
  'Slide',
  'Zoom',
```

-

### Popper Options

**position**

- The CSS position property to be applied.
- Options: `absolute` (default) | `fixed`

**placement**

- The preferred placement of the popper.
- Default is `bottom-center`
- Options:

```javascript
'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-star',
  'bottom-end',
  'left',
  'left-start',
  'left-end';
```

**arrow**

- An object specifying arrow options.
- Options:

```javascript
{
  id: 'arrow' (default) // id of arrow element to be positioned
  width: 16 (default) // the number of pixels for each side of the arrow
}
```

**autoPlace**

- Can be a boolean to enable or disable automatic placement of the popper or an Object with options passed to its helper function.
- Default is `false`
- Options:

```javascript
{
  crossAxis?: false (default) | true
  alignment?:  'top' | 'right' | 'bottom' | 'left' // Default is undefined
  autoAlignment?: true (default) | false
  allowedPlacements?: ['top', 'right', 'bottom', 'left'] + ['start', 'center', 'end'] // Default is all placements
}
```

**avoidCollisions**

- Can be a boolean to enable or disable collision avoidance or an Object with options passed to its helper function.
- Default is `true`
- Options:

```javascript
{
  limitShift: {
     mainAxis: true (default) | false
     crossAxis: true (default) | false
     offset: 0 (default) // Offset when the limiting starts. A positive number will start limiting earlier, while negative later.
  }
}
```

**shift**

- An object or boolean to enable or disable shifting.
- Default is `true`

```javascript
{
  mainAxis?: true (default) | false
  crossAxis?: false (default) | true
  limiter?: avoidCollisions // a function that limits the shifting done
}
```

**autoUpdate**

- Can be a boolean to enable or disable automatic updates or an Object with options passed to its helper function.
- Default is `true`
- Options:

```javascript
{
  ancestorScroll?: true (default) | false
  ancestorResize?: true (default) | false
  elementResize?: true (default) | false
  animationFrame?: false (default) | true
}
```

**flip**

- Can be a boolean to enable or disable flipping or an Object with options passed to its helper function.
- Default is `true`
- Options:

```javascript
{
  mainAxis?: true (default) | false
  crossAxis?: true (default) | false
  fallbackAxisSideDirection?: 'none' (default) | 'start' | 'end' // 'start' represents 'top' or 'left'. 'end' represents 'bottom' or 'right'. RTL is reversed
  flipAlignment?: true (default) | false
  fallbackPlacements?:  ['top', 'right', 'bottom', 'left'] // Default is the opposite placement from the main one.
  fallbackStrategy?: 'bestFit' (default) | 'initialPlacement'
}
```

**hide**

- Can be a boolean to enable or disable hiding or an Object with options passed to its helper function.
- Default is `true`
- Options:

```javascript
{
 strategy?: 'referenceHidden' (default) | 'escaped'
}
```

**inlnine**

- Can be a boolean to enable or disable positioning for inline reference elements that span over multiple lines.
- Default is `false`

```javascript
{
  x?: undefined | number
  y?: undefined | number
  padding?: 2 (defualt) | SideObject;
}
```

**offset**

- The offset of the popper from the anchor element.
- Default is `5`

```javascript
{
  mainAxis?: 5 (default)
  crossAxis?: 0 (default)
  alignmentAxis?: null (default) // A positive number will move in the direction of the opposite edge aligned, a negative number the reverse
}
```

**size**

- Can be a boolean to enable or disable changing the size of the floating element. Useful for long dropdowns that become scrollable without specifying a fixed height.

```javascript
{
  apply({ availableWidth, availableHeight, elements }) {
    Object.assign(elements.floating.style, {
      maxWidth: `${availableWidth}px`,
      maxHeight: `${availableHeight}px`
    });
  }
}
```

### BasePopper, PopperArrow, PopperTooltip

These sub-components are internal implementations that help create the final Popper component. BasePopper can be accessed directly.
