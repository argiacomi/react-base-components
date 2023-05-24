import * as React from 'react';
import { Checkbox } from '@components';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function ColorCheckboxes() {
  return (
    <div>
      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} defaultChecked color='secondary' />
      <Checkbox {...label} defaultChecked color='success' />
      <Checkbox {...label} defaultChecked color='warning' />
      <Checkbox {...label} defaultChecked color='danger' />
      <Checkbox {...label} defaultChecked color='default' />
    </div>
  );
}
