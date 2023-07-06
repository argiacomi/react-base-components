import { Accordion, AccordionDetails, AccordionSummary, Icon, Stack, Text } from '@components';
import React from 'react';
import styled from '@styles';

const ExpandMoreIcon = (props) => <Icon icon='MdExpandMore' {...props} />;

function SimpleAccordion() {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Text>Accordion 1</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Text>Accordion 2</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3a-content'
          id='panel3a-header'
        >
          <Text>Disabled Accordion</Text>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}

function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
        >
          <Text sx={{ width: '33%', flexShrink: 0 }}>General settings</Text>
          <Text sx={{ color: 'text.secondary' }}>I am an accordion</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2bh-content'
          id='panel2bh-header'
        >
          <Text sx={{ width: '33%', flexShrink: 0 }}>Users</Text>
          <Text sx={{ color: 'text.secondary' }}>You are currently not an owner</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3bh-content'
          id='panel3bh-header'
        >
          <Text sx={{ width: '33%', flexShrink: 0 }}>Advanced settings</Text>
          <Text sx={{ color: 'text.secondary' }}>
            Filtering has been entirely disabled for whole web server
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Text>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel4bh-content'
          id='panel4bh-header'
        >
          <Text sx={{ width: '33%', flexShrink: 0 }}>Personal data</Text>
        </AccordionSummary>
        <AccordionDetails>
          <Text>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Text>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.color.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.color.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .AccordionSummary-ExpandIconWrapper.Expanded': {
    transform: 'rotate(90deg)'
  },
  '& .AccordionSummary-Content': {
    marginLeft: theme.spacing(1)
  }
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <StyledAccordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <StyledAccordionSummary
          expandIcon={<Icon icon='MdArrowForwardIos' sx={{ fontSize: '0.9rem' }} />}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          <Text>Collapsible Group Item #1</Text>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Text>
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledAccordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <StyledAccordionSummary
          expandIcon={<Icon icon='MdArrowForwardIos' sx={{ fontSize: '0.9rem' }} />}
          aria-controls='panel2d-content'
          id='panel2d-header'
        >
          <Text>Collapsible Group Item #2</Text>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Text>
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledAccordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <StyledAccordionSummary
          expandIcon={<Icon icon='MdArrowForwardIos' sx={{ fontSize: '0.9rem' }} />}
          aria-controls='panel3d-content'
          id='panel3d-header'
        >
          <Text>Collapsible Group Item #3</Text>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Text>
        </StyledAccordionDetails>
      </StyledAccordion>
    </div>
  );
}

export default function AccordionDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Accordion</Text>
        <SimpleAccordion />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled Accordions</Text>
        <ControlledAccordions />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized Accordion</Text>
        <CustomizedAccordions />
      </Stack>
    </Stack>
  );
}
