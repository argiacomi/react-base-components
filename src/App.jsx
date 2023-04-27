import React, { useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  AppBar,
  ButtonBase,
  ButtonGroup,
  Button,
  IconButton,
  Paper,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar
} from '@component';
import { ChevronDownIcon } from 'lucide-react';

export default function App(props) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <AccordionGroup>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
        >
          <span className='w-1/3 flex-shrink-0'>General settings</span>
          <span className='text-gray-700'>I am an accordion</span>
        </AccordionSummary>
        <AccordionDetails>
          <span>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </span>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls='panel2bh-content'
          id='panel2bh-header'
        >
          <span className='w-1/3 flex-shrink-0'>Users</span>
          <span className='text-gray-700'>You are currently not an owner</span>
        </AccordionSummary>
        <AccordionDetails>
          <span>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </span>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls='panel3bh-content'
          id='panel3bh-header'
        >
          <span className='w-1/3 flex-shrink-0'>Advanced settings</span>
          <span className='text-gray-700'>
            Filtering has been entirely disabled for whole web server
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <span>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </span>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls='panel4bh-content'
          id='panel4bh-header'
        >
          <span className='w-1/3 flex-shrink-0'>Personal data</span>
        </AccordionSummary>
        <AccordionDetails>
          <span>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </span>
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
}
