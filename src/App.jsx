import * as React from 'react';
import { Paper, Button, Fade, Popper } from '@components';

export default function TransitionsPopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <div className='overflow-hidden rounded-lg border border-gray-100 text-gray-900 shadow [color-scheme:light] dark:border-none'>
      <div className='bg-gray-75'>
        <div className='flex h-12 items-center justify-center font-bold'></div>
      </div>
      <div className='relative h-[20rem] overflow-hidden bg-gray-50 p-2'>
        <Popper
          open={open}
          anchorEl={anchorEl}
          componentsProps={{ arrow: { classes: 'bg-white dark:bg-black' } }}
          popperOptions={{ placement: placement }}
          transition
        >
          {({ TransitionProps }) => (
            <Paper className='flex h-10 items-center'>
              <p className='m-0 p-1'>The content of the Popper.</p>
            </Paper>
          )}
        </Popper>
        <div className='container flex justify-center'>
          <Button onClick={handleClick('top-start')}>top-start</Button>
          <Button onClick={handleClick('top')}>top</Button>
          <Button onClick={handleClick('top-end')}>top-end</Button>
        </div>
        <div className='align-end container flex flex-col justify-between'>
          <div className='container flex justify-evenly'>
            <Button onClick={handleClick('left-start')}>left-start</Button>
            <Button onClick={handleClick('right-start')}>right-start</Button>
          </div>
          <div className='container flex justify-evenly'>
            <Button onClick={handleClick('left')}>left</Button>
            <Button onClick={handleClick('right')}>right</Button>
          </div>
          <div className='container flex justify-evenly'>
            <Button onClick={handleClick('left-end')}>left-end</Button>
            <Button onClick={handleClick('right-end')}>right-end</Button>
          </div>
        </div>
        <div className='container flex justify-center'>
          <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
          <Button onClick={handleClick('bottom')}>bottom</Button>
          <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
        </div>
      </div>
    </div>
  );
}
