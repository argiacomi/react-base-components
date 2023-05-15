import * as React from 'react';
import { Button, Paper, Zoom } from '@components';

const icon = (
  <Paper className='m-2' elevation={4}>
    <svg className='h-[100px] w-[100px]'>
      <polygon
        className='fill-white stroke-separatorDark stroke-1'
        points='0,100 50,00, 100,100'
      />
    </svg>
  </Paper>
);

export default function SimpleZoom() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className='w-[180px]'>
      <Button onClick={handleChange}>Show from target</Button>
      <div className='flex'>
        <Zoom in={checked}>{icon}</Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '500ms' : '0ms' }}
        >
          {icon}
        </Zoom>
      </div>
    </div>
  );
}
