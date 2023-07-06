import { Box, Button, CircularProgress, Fab, Icon, LinearProgress, Stack, Text } from '@components';
import React from 'react';

function CircularIndeterminate() {
  return (
    <Box css={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

function CircularColor() {
  return (
    <Stack css={{ color: 'gray' }} spacing={2} direction='row'>
      <CircularProgress color='secondary' />
      <CircularProgress color='success' />
      <CircularProgress color='inherit' />
    </Stack>
  );
}

function CircularDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack spacing={2} direction='row'>
      <CircularProgress variant='determinate' value={25} />
      <CircularProgress variant='determinate' value={50} />
      <CircularProgress variant='determinate' value={75} />
      <CircularProgress variant='determinate' value={100} />
      <CircularProgress variant='determinate' value={progress} />
    </Stack>
  );
}

function CircularIntegration() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: 'green',
      '&:hover': {
        bgcolor: 'blue'
      }
    })
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Box css={{ display: 'flex', alignItems: 'start' }}>
      <Box width='fit-content' css={{ margin: '.5rem', position: 'relative' }}>
        <Fab aria-label='save' color='primary' css={buttonSx} onClick={handleButtonClick}>
          {success ? <Icon icon='MdCheck' /> : <Icon icon='MdSave' />}
        </Fab>
        {loading && (
          <CircularProgress
            size={68}
            css={{
              color: 'green',
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1
            }}
          />
        )}
      </Box>
      <Box width='fit-content' css={{ margin: '.5rem', position: 'relative' }}>
        <Button
          variant='filled'
          color='primary'
          css={buttonSx}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Accept terms
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            css={{
              color: 'green',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px'
            }}
          />
        )}
      </Box>
    </Box>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box css={{ position: 'relative', display: 'inline-flex', width: 'fit-content' }}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        css={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text variant='caption' component='div' color='text.secondary'>
          {`${Math.round(props.value)}%`}
        </Text>
      </Box>
    </Box>
  );
}

function CircularStatic() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <CircularProgressWithLabel value={progress} />;
}

function LinearIndeterminate() {
  return (
    <Box width={750}>
      <LinearProgress />
    </Box>
  );
}

function LinearColor() {
  return (
    <Stack css={{ width: 750, color: 'gray' }} spacing={2}>
      <LinearProgress color='secondary' />
      <LinearProgress color='success' />
      <LinearProgress color='inherit' />
    </Stack>
  );
}

function LinearDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box css={{ width: 750 }}>
      <LinearProgress variant='determinate' value={progress} />
    </Box>
  );
}

function LinearBuffer() {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box css={{ width: 750 }}>
      <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
    </Box>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box width={750} css={{ display: 'flex', alignItems: 'center' }}>
      <Box css={{ width: '100%', marginRight: '.5rem' }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box css={{ minWidth: 35 }}>
        <Text variant='body2' color='text.secondary'>{`${Math.round(props.value)}%`}</Text>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box css={{ width: 750 }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

export default function ProgressDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Circular</Text>
        <CircularIndeterminate />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Circular Color</Text>
        <CircularColor />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Circular Determinate</Text>
        <CircularDeterminate />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Interactive Integration</Text>
        <CircularIntegration />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Circular with Label</Text>
        <CircularStatic />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Linear</Text>
        <LinearIndeterminate />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Linear Color</Text>
        <LinearColor />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Linear Determinate</Text>
        <LinearDeterminate />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Linear Buffer</Text>
        <LinearBuffer />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Linear with Label</Text>
        <LinearWithValueLabel />
      </Stack>
    </Stack>
  );
}
