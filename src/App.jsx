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

export default function App(props) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Button className='m-4'>Submit</Button>
    </>
  );
}
