import React from 'react';
import styled, { useTheme } from '@styles';
import {
  Box,
  Grid,
  Icon,
  IconButton,
  Input,
  Slider,
  SliderThumb,
  sliderClasses,
  Stack,
  Text,
  Tooltip
} from '@components';

const PauseRounded = (props) => <Icon icon='MdPause' {...props} />;
const PlayArrowRounded = (props) => <Icon icon='MdPlayArrow' {...props} />;
const FastForwardRounded = (props) => <Icon icon='MdFastForward' {...props} />;
const FastRewindRounded = (props) => <Icon icon='MdFastRewind' {...props} />;
const VolumeDown = (props) => <Icon icon='MdVolumeDown' {...props} />;
const VolumeUp = (props) => <Icon icon='MdVolumeUp' {...props} />;

function ContinuousSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction='row' sx={{ mb: 1 }} alignItems='center'>
        <VolumeDown />
        <Slider aria-label='Volume' value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
      <Slider disabled defaultValue={30} aria-label='Disabled slider' />
    </Box>
  );
}

function SliderSizes() {
  return (
    <Box width={300}>
      <Slider size='small' defaultValue={70} aria-label='Small' valueLabelDisplay='auto' />
      <Slider defaultValue={50} aria-label='Default' valueLabelDisplay='auto' />
    </Box>
  );
}

function valuetext(value) {
  return `${value}°C`;
}

function DiscreteSlider() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Temperature'
        defaultValue={30}
        getAriaValueText={valuetext}
        valueLabelDisplay='auto'
        step={10}
        marks
        min={10}
        max={110}
      />
      <Slider defaultValue={30} step={10} marks min={10} max={110} disabled />
    </Box>
  );
}

function DiscreteSliderSteps() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Small steps'
        defaultValue={0.00000005}
        getAriaValueText={valuetext}
        step={0.00000001}
        marks
        min={-0.00000005}
        max={0.0000001}
        valueLabelDisplay='auto'
      />
    </Box>
  );
}

const marks = [
  {
    value: 0,
    label: '0°C'
  },
  {
    value: 20,
    label: '20°C'
  },
  {
    value: 37,
    label: '37°C'
  },
  {
    value: 100,
    label: '100°C'
  }
];

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

function DiscreteSliderValues() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Restricted values'
        defaultValue={20}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay='auto'
        marks={marks}
      />
    </Box>
  );
}

function DiscreteSliderMarks() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Custom marks'
        defaultValue={20}
        getAriaValueText={valuetext}
        step={10}
        valueLabelDisplay='auto'
        marks={marks}
      />
    </Box>
  );
}

function DiscreteSliderLabel() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Always visible'
        defaultValue={80}
        getAriaValueText={valuetext}
        step={10}
        marks={marks}
        valueLabelDisplay='on'
      />
    </Box>
  );
}

function RangeSlider() {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
      />
    </Box>
  );
}

const minDistance = 10;

function MinimumDistanceSlider() {
  const [value1, setValue1] = React.useState([20, 37]);

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  const [value2, setValue2] = React.useState([20, 37]);

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
        disableSwap
      />
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={value2}
        onChange={handleChange2}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
        disableSwap
      />
    </Box>
  );
}

const StyledInput = styled(Input)`
  width: 42px;
`;

function InputSlider() {
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Text id='input-slider' gutterBottom>
        Volume
      </Text>
      <Grid container spacing={2} alignItems='center'>
        <Grid>
          <VolumeUp />
        </Grid>
        <Grid xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
          />
        </Grid>
        <Grid>
          <StyledInput
            value={value}
            size='small'
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function ColorSlider() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Temperature'
        defaultValue={30}
        getAriaValueText={valuetext}
        color='secondary'
      />
      <Slider
        aria-label='Temperature'
        defaultValue={30}
        getAriaValueText={valuetext}
        color='success'
      />
      <Slider
        aria-label='Temperature'
        defaultValue={30}
        getAriaValueText={valuetext}
        color='warning'
      />
    </Box>
  );
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip arrow enterTouchDelay={0} open={open} placement='top' title={value}>
      {children}
    </Tooltip>
  );
}

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.color.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  padding: '15px 0',
  [`& .${sliderClasses.thumb}`]: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    [`&:focus, &:hover, &.${sliderClasses.active}`]: {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow
      }
    }
  },
  [`& .${sliderClasses.valueLabel}`]: {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.color.text.primary,
    '&:before': {
      display: 'none'
    },
    '& *': {
      background: 'transparent',
      color: theme.color.mode === 'dark' ? '#fff' : '#000'
    }
  },
  [`& .${sliderClasses.track}`]: {
    border: 'none'
  },
  [`& .${sliderClasses.rail}`]: {
    opacity: 0.5,
    backgroundColor: '#bfbfbf'
  },
  [`& .${sliderClasses.mark}`]: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    [`&.${sliderClasses.markActive}`]: {
      opacity: 1,
      backgroundColor: 'currentColor'
    }
  }
}));

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  [`& .${sliderClasses.track}`]: {
    border: 'none'
  },
  [`& .${sliderClasses.thumb}`]: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    [`&:focus, &:hover, &.${sliderClasses.active}, &.${sliderClasses.focusVisible}`]: {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  [`& .${sliderClasses.valueLabel}`]: {
    top: -10,
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    [`&.${sliderClasses.valueLabelOpen}`]: {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      // transform: 'rotate(45deg)'
    }
  }
});

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: '#3a8589',
  height: 3,
  padding: '13px 0',
  [`& .${sliderClasses.thumb}`]: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)'
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  [`& .${sliderClasses.track}`]: {
    height: 3
  },
  [`& .${sliderClasses.rail}`]: {
    color: theme.color.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.color.mode === 'dark' ? undefined : 1,
    height: 3
  }
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className='airbnb-bar' />
      <span className='airbnb-bar' />
      <span className='airbnb-bar' />
    </SliderThumb>
  );
}

function CustomizedSlider() {
  return (
    <Box sx={{ width: 320 }}>
      <Text gutterBottom>iOS</Text>
      <IOSSlider aria-label='ios slider' defaultValue={60} marks={marks} valueLabelDisplay='on' />
      <Box sx={{ m: 3 }} />
      <Text gutterBottom>pretto.fr</Text>
      <PrettoSlider valueLabelDisplay='auto' aria-label='pretto slider' defaultValue={20} />
      <Box sx={{ m: 3 }} />
      <Text gutterBottom>Tooltip value label</Text>
      <Slider
        valueLabelDisplay='auto'
        slots={{
          valueLabel: ValueLabelComponent
        }}
        aria-label='custom thumb label'
        defaultValue={20}
      />
      <Box sx={{ m: 3 }} />
      <Text gutterBottom>Airbnb</Text>
      <AirbnbSlider
        slots={{ thumb: AirbnbThumbComponent }}
        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
        defaultValue={[20, 40]}
      />
    </Box>
  );
}

const WallPaper = styled('div')({
  position: 'relative',
  width: 500,
  height: 350,
  top: -330,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&:before': {
    content: '""',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background: 'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)'
  },
  '&:after': {
    content: '""',
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)'
  }
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: theme.color.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)'
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%'
  }
});

const TinyText = styled(Text)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2
});

function MusicPlayerSlider() {
  const theme = useTheme();
  const duration = 200; // seconds
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(false);
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const mainIconColor = theme.color.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor = theme.color.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  return (
    <Box sx={{ width: '100%', overflow: 'hidden', padding: '1rem', height: '320px' }}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
              alt="can't win - Chilling Sunday"
              src='/static/images/sliders/chilling-sunday.jpg'
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Text variant='caption' color='text.secondary' fontWeight={500}>
              Jun Pulse
            </Text>
            <Text noWrap>
              <b>คนเก่าเขาทำไว้ดี (Can&apos;t win)</b>
            </Text>
            <Text noWrap letterSpacing={-0.25}>
              Chilling Sunday &mdash; คนเก่าเขาทำไว้ดี
            </Text>
          </Box>
        </Box>
        <Slider
          aria-label='time-indicator'
          size='small'
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value)}
          sx={{
            color: theme.color.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            [`& .${sliderClasses.thumb}`]: {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
              },
              [`&:hover, &.${sliderClasses.thumb}`]: {
                boxShadow: `0px 0px 0px 8px ${
                  theme.color.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'
                }`
              },
              [`&.${sliderClasses.active}`]: {
                width: 20,
                height: 20
              }
            },
            [`& .${sliderClasses.rail}`]: {
              opacity: 0.28
            }
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1
          }}
        >
          <IconButton aria-label='previous song'>
            <FastRewindRounded size='large' htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label={paused ? 'play' : 'pause'} onClick={() => setPaused(!paused)}>
            {paused ? (
              <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label='next song'>
            <FastForwardRounded size='large' htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack spacing={2} direction='row' sx={{ mb: 1, px: 1 }} alignItems='center'>
          <VolumeDown htmlColor={lightIconColor} />
          <Slider
            aria-label='Volume'
            defaultValue={30}
            sx={{
              color: theme.color.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none'
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&:before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none'
                }
              }
            }}
          />
          <VolumeUp htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      <WallPaper />
    </Box>
  );
}

function VerticalSlider() {
  return (
    <Stack sx={{ height: 300 }} spacing={1} direction='row'>
      <Slider
        aria-label='Temperature'
        orientation='vertical'
        getAriaValueText={valuetext}
        valueLabelDisplay='auto'
        defaultValue={30}
      />
      <Slider
        aria-label='Temperature'
        orientation='vertical'
        defaultValue={30}
        valueLabelDisplay='auto'
        disabled
      />
      <Slider
        getAriaLabel={() => 'Temperature'}
        orientation='vertical'
        getAriaValueText={valuetext}
        defaultValue={[20, 37]}
        valueLabelDisplay='auto'
        marks={marks}
      />
    </Stack>
  );
}

const Separator = styled('div')(
  ({ theme }) => `
  height: ${theme.spacing(3)};
`
);

function TrackFalseSlider() {
  return (
    <Box sx={{ width: 250 }}>
      <Text id='track-false-slider' gutterBottom>
        Removed track
      </Text>
      <Slider
        track={false}
        aria-labelledby='track-false-slider'
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Separator />
      <Text id='track-false-range-slider' gutterBottom>
        Removed track range slider
      </Text>
      <Slider
        track={false}
        aria-labelledby='track-false-range-slider'
        getAriaValueText={valuetext}
        defaultValue={[20, 37, 50]}
        marks={marks}
      />
    </Box>
  );
}

function TrackInvertedSlider() {
  return (
    <Box sx={{ width: 250 }}>
      <Text id='track-inverted-slider' gutterBottom>
        Inverted track
      </Text>
      <Slider
        track='inverted'
        aria-labelledby='track-inverted-slider'
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Separator />
      <Text id='track-inverted-range-slider' gutterBottom>
        Inverted track range
      </Text>
      <Slider
        track='inverted'
        aria-labelledby='track-inverted-range-slider'
        getAriaValueText={valuetext}
        defaultValue={[20, 37]}
        marks={marks}
      />
    </Box>
  );
}

function valueLabelFormatSize(value) {
  const units = ['KB', 'MB', 'GB', 'TB'];

  let unitIndex = 0;
  let scaledValue = value;

  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledValue /= 1024;
  }

  return `${scaledValue} ${units[unitIndex]}`;
}

function calculateValue(value) {
  return 2 ** value;
}

function NonLinearSlider() {
  const [value, setValue] = React.useState(10);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Text id='non-linear-slider' gutterBottom>
        Storage: {valueLabelFormatSize(calculateValue(value))}
      </Text>
      <Slider
        value={value}
        min={5}
        step={1}
        max={30}
        scale={calculateValue}
        getAriaValueText={valueLabelFormatSize}
        valueLabelFormat={valueLabelFormatSize}
        onChange={handleChange}
        valueLabelDisplay='auto'
        aria-labelledby='non-linear-slider'
      />
    </Box>
  );
}

export default function SliderDemo() {
  return (
    <Grid container columnSpacing={2}>
      <Grid container xs={4} spacing={3}>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Continuous Slider</Text>
          <ContinuousSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Slider Sizes</Text>
          <SliderSizes />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Discrete Slider</Text>
          <DiscreteSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Small Steps Slider</Text>
          <DiscreteSliderSteps />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Custom Steps Slider</Text>
          <DiscreteSliderValues />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Custom Marks Slider</Text>
          <DiscreteSliderMarks />
        </Grid>
      </Grid>
      <Grid container xs={4} spacing={3}>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Label Always On Slider</Text>
          <DiscreteSliderLabel />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Range Slider</Text>
          <RangeSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Minimum Distance Slider</Text>
          <MinimumDistanceSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Slider With Input Field</Text>
          <InputSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Slider Colors</Text>
          <ColorSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Custom Sliders</Text>
          <CustomizedSlider />
        </Grid>
      </Grid>
      <Grid container xs={4} spacing={8}>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Music Player</Text>
          <MusicPlayerSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Vertical Sliders</Text>
          <VerticalSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Removed Track</Text>
          <TrackFalseSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Inverted Track</Text>
          <TrackInvertedSlider />
        </Grid>
        <Grid width='fit-content' display='inline-block' spacing={1} direction='column'>
          <Text variant='h6'>Non-Linear Scale</Text>
          <NonLinearSlider />
        </Grid>
      </Grid>
    </Grid>
  );
}
