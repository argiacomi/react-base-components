import React from 'react';
import { styled } from '@styles';
import {
  Box,
  ClickAwayListener,
  Grid,
  Button,
  IconButton,
  Popper,
  Stack,
  Text,
  Tooltip,
  tooltipClasses
} from '@components';

const LightTooltip = styled(Popper)(({ theme }) => ({
  backgroundColor: theme.color.white,
  color: 'rgba(0, 0, 0, 0.87)',
  boxShadow: theme.boxShadow[1],
  fontSize: 11
}));

const BootstrapTooltip = styled(Popper)(({ theme }) => ({
  backgroundColor: theme.color.background,
  [`.${tooltipClasses.arrow}::before`]: {
    backgroundColor: theme.color.background
  }
}));

const HtmlTooltip = styled(Popper)(({ theme }) => ({
  backgroundColor: '#f5f5f9',
  color: 'rgba(0, 0, 0, 0.87)',
  maxWidth: 220,
  fontSize: theme.spacing(12 / 8),
  border: '1px solid #dadde9'
}));

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
        <Grid item>
          <Tooltip disableFocusListener title='Add'>
            <Button>Hover or touch</Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip disableHoverListener title='Add'>
            <Button>Focus or touch</Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip disableFocusListener disableTouchListener title='Add'>
            <Button>Hover</Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title='Add'
              >
                <Button onClick={handleTooltipOpen}>Click</Button>
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

const CustomWidthTooltip = styled(Popper)({
  maxWidth: 500
});

const NoMaxWidthTooltip = styled(Popper)({
  maxWidth: 'none'
});

const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

function VariableWidth() {
  return (
    <Box css={{ width: '100%' }}>
      <Tooltip title={longText}>
        <Button css={{ margin: '.5rem' }}>Default Width [300px]</Button>
      </Tooltip>
      <Tooltip slots={{ popper: CustomWidthTooltip }} title={longText}>
        <Button css={{ margin: '.5rem' }}>Custom Width [500px]</Button>
      </Tooltip>
      <Tooltip slots={{ popper: NoMaxWidthTooltip }} title={longText}>
        <Button css={{ margin: '.5rem' }}>No wrapping</Button>
      </Tooltip>
    </Box>
  );
}

function TransitionsTooltips() {
  return (
    <div>
      <Tooltip title='Add'>
        <Button>Grow</Button>
      </Tooltip>
      <Tooltip transition='Fade' TransitionProps={{ timeout: 600 }} title='Add'>
        <Button>Fade</Button>
      </Tooltip>
      <Tooltip transition='Zoom' title='Add'>
        <Button>Zoom</Button>
      </Tooltip>
    </div>
  );
}

function AnchorElTooltips() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const positionRef = React.useRef({
    x: 0,
    y: 0
  });
  const areaRef = React.useRef(null);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    setAnchorEl({
      getBoundingClientRect: () => {
        return new DOMRect(positionRef.current.x, areaRef.current.getBoundingClientRect().y, 0, 0);
      }
    });
  };

  return (
    <Tooltip title='Add' placement='top' arrow anchorEl={anchorEl}>
      <Box
        ref={areaRef}
        onMouseMove={handleMouseMove}
        css={({ theme }) => ({
          backgroundColor: theme.color.primary.body,
          color: theme.color.white,
          padding: '1rem',
          width: 75,
          height: 55
        })}
      >
        Hover
      </Box>
    </Tooltip>
  );
}

function DelayTooltips() {
  return (
    <Tooltip title='Add' enterDelay={500} leaveDelay={200}>
      <Button>[500ms, 200ms]</Button>
    </Tooltip>
  );
}

export default function TooltipDemo() {
  return (
    <Stack direction='column' spacing={4}>
      <Tooltip title='Delete'>
        <IconButton icon='MdDelete' />
      </Tooltip>
      <Box css={{ width: 500 }}>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Tooltip title='Add' placement='top-start'>
              <Button>top-start</Button>
            </Tooltip>
            <Tooltip title='Add' placement='top'>
              <Button>top</Button>
            </Tooltip>
            <Tooltip title='Add' placement='top-end'>
              <Button>top-end</Button>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid xs={6}>
            <Tooltip title='Add' placement='left-start'>
              <Button>left-start</Button>
            </Tooltip>
            <br />
            <Tooltip title='Add' placement='left'>
              <Button>left</Button>
            </Tooltip>
            <br />
            <Tooltip title='Add' placement='left-end'>
              <Button>left-end</Button>
            </Tooltip>
          </Grid>
          <Grid container xs={6} css={{ alignItems: 'flex-end' }} direction='column'>
            <Grid>
              <Tooltip title='Add' placement='right-start'>
                <Button>right-start</Button>
              </Tooltip>
            </Grid>
            <Grid>
              <Tooltip title='Add' placement='right'>
                <Button>right</Button>
              </Tooltip>
            </Grid>
            <Grid>
              <Tooltip title='Add' placement='right-end'>
                <Button>right-end</Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Tooltip title='Add' placement='bottom-start'>
              <Button>bottom-start</Button>
            </Tooltip>
            <Tooltip title='Add' placement='bottom'>
              <Button>bottom</Button>
            </Tooltip>
            <Tooltip title='Add' placement='bottom-end'>
              <Button>bottom-end</Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <div>
        <Tooltip slots={{ popper: LightTooltip }} title='Add'>
          <Button>Light</Button>
        </Tooltip>
        <Tooltip slots={{ popper: BootstrapTooltip }} arrow title='Add'>
          <Button>Bootstrap</Button>
        </Tooltip>
        <Tooltip
          slots={{ popper: HtmlTooltip }}
          title={
            <React.Fragment>
              <Text color='inherit'>Tooltip with HTML</Text>
              <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
              {"It's very engaging. Right?"}
            </React.Fragment>
          }
        >
          <Button>HTML</Button>
        </Tooltip>
      </div>
      <Box css={{ width: 500 }}>
        <Tooltip title='Add' arrow>
          <Button>Arrow</Button>
        </Tooltip>
      </Box>
      <TriggersTooltips />
      <Box css={{ width: 500 }}>
        <ControlledTooltips />
      </Box>
      <VariableWidth />
      <Box css={{ width: 500 }}>
        <Tooltip title='Add' disableInteractive>
          <Button>Not interactive</Button>
        </Tooltip>
      </Box>
      <Box css={{ width: 500 }}>
        <Tooltip title="You don't have permission to do this">
          <span>
            <Button disabled>A Disabled Button</Button>
          </span>
        </Tooltip>
      </Box>
      <TransitionsTooltips />
      <Tooltip title="You don't have permission to do this" followCursor>
        <Box
          css={({ theme }) => ({
            backgroundcColor: theme.color.disabled.body,
            color: theme.color.background,
            padding: '1rem',
            width: 140
          })}
        >
          Disabled Action
        </Box>
      </Tooltip>
      <AnchorElTooltips />
      <Box css={{ width: 200 }}>
        <DelayTooltips />
      </Box>
    </Stack>
  );
}
