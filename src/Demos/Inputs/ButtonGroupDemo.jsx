import { Button, ButtonGroup, Icon, Stack, Text } from '@components';
import { css } from 'styled-components/macro';
import React from 'react';

const buttons = [
  <Button key='one'>One</Button>,
  <Button key='two'>Two</Button>,
  <Button key='three'>Three</Button>
];

const HorizontalButtonGroupCycle = () => {
  const colors = ['primary', 'secondary', 'monochrome', 'default'];
  const variants = ['text', 'outlined', 'filled', 'colorText'];

  return (
    <Stack spacing={1} direction='row'>
      {variants.map((variant, index) => (
        <Stack key={index} spacing={1} direction='column'>
          {colors.map((color, index) => (
            <ButtonGroup
              key={index}
              color={color}
              variant={variant}
              orientation='horizontal'
              aria-label='outlined primary button group'
            >
              {buttons}
            </ButtonGroup>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

const VerticalButtonGroupCycle = () => {
  const colors = ['primary', 'secondary', 'monochrome', 'default'];
  const variants = ['text', 'outlined', 'filled', 'colorText'];

  return (
    <Stack spacing={1} direction='row'>
      {variants.map((variant, index) => (
        <Stack key={index} spacing={1} direction='row'>
          {colors.map((color, index) => (
            <ButtonGroup
              key={index}
              color={color}
              variant={variant}
              orientation='vertical'
              aria-label='outlined primary button group'
            >
              {buttons}
            </ButtonGroup>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

function GroupSizesColors() {
  const sizes = ['mini', 'small', 'medium', 'large', 'jumbo', 'auto'];
  return (
    <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
      {sizes.map((size, index) => (
        <ButtonGroup key={index} size={size} aria-label='outlined primary button group'>
          {buttons}
        </ButtonGroup>
      ))}
    </Stack>
  );
}

function SplitButton() {
  return (
    <React.Fragment>
      <ButtonGroup variant='filled' aria-label='split button'>
        <Button>Squash and Merge</Button>
        <Button
          size='small'
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
        >
          <Icon icon='MdArrowDropDown' />
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}

function DisableElevation() {
  return (
    <ButtonGroup disableElevation variant='filled' aria-label='Disabled elevation buttons'>
      <Button>One</Button>
      <Button>Two</Button>
    </ButtonGroup>
  );
}

export default function ButtonGroupDemo() {
  return (
    <Stack spacing={5} direction='column' width={750}>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Button Variants</Text>
        <HorizontalButtonGroupCycle />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Vertical Button Groups</Text>
        <VerticalButtonGroupCycle />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Buttons Group Sizes & Colors</Text>
        <GroupSizesColors />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Split Buttons</Text>
        <SplitButton />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Disable Elevation</Text>
        <DisableElevation />
      </Stack>
    </Stack>
  );
}
