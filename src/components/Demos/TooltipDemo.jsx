import React from 'react';
import styled from 'styled-components/macro';
import {
  Box,
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

export default function TooltipDemo() {
  return (
    <Stack direction='column' spacing={2}>
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
        <Tooltip
          slots={{ popper: BootstrapTooltip }}
          popperOptions={{
            arrow: {
              id: 'arrow',
              width: 15,
              padding: 4
            }
          }}
          arrow
          title='Add'
        >
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
    </Stack>
  );
}
