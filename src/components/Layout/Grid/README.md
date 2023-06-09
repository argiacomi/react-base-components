# Grid Component Documentation

## Overview

The Grid component is a responsive layout grid that adapts to screen size and orientation, ensuring consistency across layouts and is designed to provide a flexible way to layout your UI. It uses CSS Flexbox to create a grid structure and organizes children components within the grid.

## Features

The Grid component comes with several features:

- Uses CSS Custom Properties (variables) to define the grid structure.
- Provides a responsive layout using custom breakpoints.
- Can define the number of columns, the direction of content items, wrapping behavior, and spacing between items.
- Handles overflow and offsets of the grid.
- Handles different levels of grid nesting, which allows for more complex layouts.

## Props

The Grid component takes the following props:

- `className`: The CSS class to apply to the grid component.
- `columns`: Defines the number of columns in the grid. The default is `12`.
- `container`: If set to true, this indicates the Grid is a container that wraps items.
- `component`: Determines the root node component type. Default is `div`.
- `direction`: Determines the direction of the content items. The default is `row`.
- `wrap`: Determine if and how to content should wrap via CSS `flexWrap`. The default is `wrap`.
- `spacing`: Determines the `8px` increments for spacing between the grid cells. Default is `0`.
- `rowSpacing`: Determines the `8px` increments for row spacing between the grid cells. Defaults to `spacing` if not provided.
- `columnSpacing`: Determines the `8px` increments for column spacing between the grid cells. Defaults to `spacing` if not provided.
- `disableEqualOverflow`: If set to `true`, disables the equal overflow property of the grid.
- `breakpoints`: An object that can be used to define custom breakpoints.

- `Size`: These props determine the width of a `Grid` item. They are entered as `breakpoint` props (e.g. `xs={6} md={4}`)

  - Size props accept:
    - `numbers`: Will set an item's width to the specified number of columns.
    - `auto`: Will set an item's width equal to its content.

- `Offset`: These props push an item to the right side of the grid. They can be customized for responsive breakpoints by combining the breakpoint with `Offset` (e.g. `mdOffset={2}`)

  - Offset props accept:
    - `numbers`: Will push an item the specified number of columns to the right.
    - `auto`: Will push the item to the far right side of the grid container.

## Usage

You can use the Grid component to create complex layouts. It's useful when you need to divide a page into various parts for different types of content.

```javascript
import Grid from '@components';

function Component() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item>xs=8</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>xs=4</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>xs=4</Item>
      </Grid>
      <Grid item xs={8}>
        <Item>xs=8</Item>
      </Grid>
    </Grid>
  );
}
```
