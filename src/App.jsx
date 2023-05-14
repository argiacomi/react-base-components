import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Text
} from '@components';

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls='panel1bh-content' id='panel1bh-header'>
          <Text className='w-[33%] flex-shrink-0'>General settings</Text>
          <Text className='text-secondary-500'>I am an accordion</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls='panel2bh-content' id='panel2bh-header'>
          <Text className='w-[33%] flex-shrink-0'>Users</Text>
          <Text className='text-secondary-500'>
            You are currently not an owner
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls='panel3bh-content' id='panel3bh-header'>
          <Text className='w-[33%] flex-shrink-0'>Advanced settings</Text>
          <Text className='text-secondary-500'>
            Filtering has been entirely disabled for whole web server
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary aria-controls='panel4bh-content' id='panel4bh-header'>
          <Text className='w-[33%] flex-shrink-0'>Personal data</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Text>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
// import * as React from 'react';
// import { Popper, Text, Grid, Button, Grow, Paper } from '@components';

// export default function PositionedPopper() {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [open, setOpen] = React.useState(false);
//   const [placement, setPlacement] = React.useState();

//   const handleClick = (newPlacement) => (event) => {
//     setAnchorEl(event.currentTarget);
//     setOpen((prev) => placement !== newPlacement || !prev);
//     setPlacement(newPlacement);
//   };

//   return (
//     <div className='w-[500px]'>
//       <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
//         {({ TransitionProps }) => (
//           <Grow {...TransitionProps} timeout={350}>
//             <Paper>
//               <Text className='p-4'>The content of the Popper.</Text>
//             </Paper>
//           </Grow>
//         )}
//       </Popper>
//       <Grid container className='justify-center'>
//         <Grid item>
//           <Button onClick={handleClick('top-start')}>top-start</Button>
//           <Button onClick={handleClick('top')}>top</Button>
//           <Button onClick={handleClick('top-end')}>top-end</Button>
//         </Grid>
//       </Grid>
//       <Grid container className='justify-center'>
//         <Grid item size={{ xs: 6 }}>
//           <Button onClick={handleClick('left-start')}>left-start</Button>
//           <br />
//           <Button onClick={handleClick('left')}>left</Button>
//           <br />
//           <Button onClick={handleClick('left-end')}>left-end</Button>
//         </Grid>
//         <Grid
//           item
//           container
//           size={{ xs: 6 }}
//           className='items-end'
//           direction='column'
//         >
//           <Grid item>
//             <Button onClick={handleClick('right-start')}>right-start</Button>
//           </Grid>
//           <Grid item>
//             <Button onClick={handleClick('right')}>right</Button>
//           </Grid>
//           <Grid item>
//             <Button onClick={handleClick('right-end')}>right-end</Button>
//           </Grid>
//         </Grid>
//       </Grid>
//       <Grid container className='justify-center'>
//         <Grid item>
//           <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
//           <Button onClick={handleClick('bottom')}>bottom</Button>
//           <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }
