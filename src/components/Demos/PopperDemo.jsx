import React from 'react';
import { Box, Popper, Text as Typography, Grid, Button } from '@components';

export default function PopperDemo() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Box css={{ margin: '1rem', height: 750, width: 500 }}>
      <Box css={{ height: 1000, width: 500 }}>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition='Grow'
          square
          disableArrow
          outlined
        >
          <Typography css={{ padding: '1rem' }}>The content of the Popper.</Typography>
        </Popper>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Button onClick={handleClick('top-start')}>top-start</Button>
            <Button onClick={handleClick('top')}>top</Button>
            <Button onClick={handleClick('top-end')}>top-end</Button>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid xs={6}>
            <Button onClick={handleClick('left-start')}>left-start</Button>
            <br />
            <Button onClick={handleClick('left')}>left</Button>
            <br />
            <Button onClick={handleClick('left-end')}>left-end</Button>
          </Grid>
          <Grid container xs={6} css={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Grid>
              <Button onClick={handleClick('right-start')}>right-start</Button>
            </Grid>
            <Grid>
              <Button onClick={handleClick('right')}>right</Button>
            </Grid>
            <Grid>
              <Button onClick={handleClick('right-end')}>right-end</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
            <Button onClick={handleClick('bottom')}>bottom</Button>
            <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
