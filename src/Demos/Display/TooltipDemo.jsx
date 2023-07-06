import React from 'react';
import styled from '@styles';
import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  IconButton,
  Stack,
  Text,
  Tooltip,
  tooltipClasses
} from '@components';

function BasicTooltip() {
  return (
    <Tooltip title='Delete'>
      <IconButton icon='MdDelete' />
    </Tooltip>
  );
}

function PositionedTooltips() {
  return (
    <Box sx={{ width: 500 }}>
      <Grid container justifyContent='center'>
        <Grid>
          <Tooltip title='Add' placement='top-start'>
            <Button variant='colorText'>top-start</Button>
          </Tooltip>
          <Tooltip title='Add' placement='top'>
            <Button variant='colorText'>top</Button>
          </Tooltip>
          <Tooltip title='Add' placement='top-end'>
            <Button variant='colorText'>top-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container justifyContent='center'>
        <Grid xs={6}>
          <Tooltip title='Add' placement='left-start'>
            <Button variant='colorText'>left-start</Button>
          </Tooltip>
          <br />
          <Tooltip title='Add' placement='left'>
            <Button variant='colorText'>left</Button>
          </Tooltip>
          <br />
          <Tooltip title='Add' placement='left-end'>
            <Button variant='colorText'>left-end</Button>
          </Tooltip>
        </Grid>
        <Grid container xs={6} alignItems='flex-end' direction='column'>
          <Grid>
            <Tooltip title='Add' placement='right-start'>
              <Button variant='colorText'>right-start</Button>
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip title='Add' placement='right'>
              <Button variant='colorText'>right</Button>
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip title='Add' placement='right-end'>
              <Button variant='colorText'>right-end</Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent='center'>
        <Grid>
          <Tooltip title='Add' placement='bottom-start'>
            <Button variant='colorText'>bottom-start</Button>
          </Tooltip>
          <Tooltip title='Add' placement='bottom'>
            <Button variant='colorText'>bottom</Button>
          </Tooltip>
          <Tooltip title='Add' placement='bottom-end'>
            <Button variant='colorText'>bottom-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

const LightTooltip = styled(Tooltip)(({ theme }) => ({
  [`&.${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.color.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.boxShadow[1],
    fontSize: 11
  }
}));

const BootstrapTooltip = styled(Tooltip)(({ theme }) => ({
  [`&.${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.color.primary.body,
    '--popper-arrow-bg': theme.color.primary.body,
    color: theme.color.white
  }
}));

const HtmlTooltip = styled(Tooltip)(({ theme }) => ({
  [`&.${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.pxToRem(12),
    border: '1px solid #dadde9'
  }
}));

function CustomizedTooltips() {
  return (
    <div>
      <LightTooltip title='Add'>
        <Button variant='colorText'>Light</Button>
      </LightTooltip>
      <BootstrapTooltip arrow title='Add'>
        <Button variant='colorText'>Bootstrap</Button>
      </BootstrapTooltip>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Text color='inherit'>Tooltip with HTML</Text>
            <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
            {"It's very engaging. Right?"}
          </React.Fragment>
        }
      >
        <Button variant='colorText'>HTML</Button>
      </HtmlTooltip>
    </div>
  );
}

function TriggersTooltips() {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Grid container justifyContent='center'>
        <Grid>
          <Tooltip disableFocusListener title='Add'>
            <Button variant='colorText'>Hover or touch</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <Tooltip disableHoverListener title='Add'>
            <Button variant='colorText'>Focus or touch</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <Tooltip disableFocusListener disableTouchListener title='Add'>
            <Button variant='colorText'>Hover</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                disablePortal
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title='Add'
              >
                <Button variant='colorText' onClick={handleTooltipOpen}>
                  Click
                </Button>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </div>
  );
}

function ControlledTooltips() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Tooltip open={open} onClose={handleClose} onOpen={handleOpen} title='Add'>
      <Button>Controlled</Button>
    </Tooltip>
  );
}

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500
  }
});

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none'
  }
});

const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

function VariableWidth() {
  return (
    <div>
      <Tooltip title={longText}>
        <Button sx={{ m: 1 }}>Default Width [300px]</Button>
      </Tooltip>
      <CustomWidthTooltip title={longText}>
        <Button sx={{ m: 1 }}>Custom Width [500px]</Button>
      </CustomWidthTooltip>
      <NoMaxWidthTooltip title={longText}>
        <Button sx={{ m: 1 }}>No wrapping</Button>
      </NoMaxWidthTooltip>
    </div>
  );
}

function NotInteractiveTooltips() {
  return (
    <Tooltip title='Add' disableInteractive>
      <Button>Not interactive</Button>
    </Tooltip>
  );
}

function DisabledTooltips() {
  return (
    <Tooltip title="You don't have permission to do this">
      <span>
        <Button disabled>A Disabled Button</Button>
      </span>
    </Tooltip>
  );
}

function TransitionsTooltips() {
  return (
    <div>
      <Tooltip TransitionProps={{ timeout: 3000 }} title='Add'>
        <Button>Grow</Button>
      </Tooltip>
      <Tooltip transition='Fade' TransitionProps={{ timeout: 3000 }} title='Add'>
        <Button>Fade</Button>
      </Tooltip>
      <Tooltip transition='Zoom' TransitionProps={{ timeout: 3000 }} title='Add'>
        <Button>Zoom</Button>
      </Tooltip>
    </div>
  );
}

function FollowCursorTooltips() {
  return (
    <Tooltip title="You don't have permission to do this" followCursor>
      <Box width='fit-content' sx={{ backgroundColor: 'disabled.text', color: 'background', p: 2 }}>
        Disabled Action
      </Box>
    </Tooltip>
  );
}

function AnchorElTooltips() {
  const positionRef = React.useRef({
    x: 0,
    y: 0
  });
  const popperRef = React.useRef(null);
  const areaRef = React.useRef(null);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };
  };

  return (
    <Tooltip
      title='Add'
      placement='top'
      arrow
      popperRef={popperRef}
      anchorEl={{
        getBoundingClientRect: () => {
          return new DOMRect(
            positionRef.current.x,
            areaRef.current.getBoundingClientRect().y,
            0,
            0
          );
        }
      }}
    >
      <Box
        width='fit-content'
        ref={areaRef}
        onMouseMove={handleMouseMove}
        backgroundColor='primary.body'
        color='primary.text'
        p={2}
      >
        Hover
      </Box>
    </Tooltip>
  );
}

function DelayTooltips() {
  return (
    <Tooltip title='Add' enterDelay={900} leaveDelay={500}>
      <Button>[900ms, 500ms]</Button>
    </Tooltip>
  );
}

export default function ListDemo() {
  return (
    <Stack spacing={5} width='fit-content' direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Tooltip</Text>
        <BasicTooltip />
      </Stack>
      {/* <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Positioned Tooltip</Text>
        <PositionedTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized Tooltips</Text>
        <CustomizedTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Tooltip Triggers</Text>
        <TriggersTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled Tooltip</Text>
        <ControlledTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Variable Width Tooltip</Text>
        <VariableWidth />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Disable Interactive Tooltip</Text>
        <NotInteractiveTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Disabled Elements Tooltip</Text>
        <DisabledTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Tooltip Transitions</Text>
        <TransitionsTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Follow Cursor Tooltip</Text>
        <FollowCursorTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Virtual Element Tooltip</Text>
        <AnchorElTooltips />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Showing & Hiding Delays Tooltip</Text>
        <DelayTooltips />
      </Stack> */}
    </Stack>
  );
}
