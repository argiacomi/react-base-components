import * as React from 'react';
import { Button, Paper, Slide } from '@components';

const icon = (
  <Paper className='m-2 h-[100px] w-[100px]' elevation={4}>
    <svg className='h-[100px] w-[100px]'>
      <polygon
        className='fill-white stroke-separatorDark stroke-1'
        points='0,100 50,00, 100,100'
      />
    </svg>
  </Paper>
);

export default function SlideFromContainer() {
  const [checked, setChecked] = React.useState(false);
  const containerRef = React.useRef(null);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div
      className='flex h-[180px] w-[240px] overflow-hidden rounded-sm bg-gray-100 p-4 dark:bg-gray-900'
      ref={containerRef}
    >
      <div className='w-[200px]'>
        <Button onClick={handleChange}>Show from target</Button>
        <Slide direction='up' in={checked} container={containerRef.current}>
          {icon}
        </Slide>
      </div>
    </div>
  );
}
