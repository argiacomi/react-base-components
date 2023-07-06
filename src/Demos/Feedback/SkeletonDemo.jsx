import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Text
} from '@components';
import React from 'react';
import styled from '@styles';

function Variants() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant='text' width={210} sx={{ fontSize: '1rem' }} />
      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant='circular' width={40} height={40} />
      <Skeleton variant='rectangular' width={210} height={60} />
      <Skeleton variant='rounded' width={210} height={60} />
    </Stack>
  );
}

function Animations() {
  return (
    <Box sx={{ width: 300 }}>
      <Skeleton />
      <Skeleton animation='wave' />
      <Skeleton animation={false} />
    </Box>
  );
}

const data = [
  {
    src: 'https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ',
    title: 'Don Diablo @ Tomorrowland Main Stage 2019 | Official…',
    channel: 'Don Diablo',
    views: '396k views',
    createdAt: 'a week ago'
  },
  {
    src: 'https://i.ytimg.com/vi/_Uu12zY01ts/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpX6Jan2rxrCAZxJYDXppTP4MoQA',
    title: 'Queen - Greatest Hits',
    channel: 'Queen Official',
    views: '40M views',
    createdAt: '3 years ago'
  },
  {
    src: 'https://i.ytimg.com/vi/kkLk2XWMBf8/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLB4GZTFu1Ju2EPPPXnhMZtFVvYBaw',
    title: 'Calvin Harris, Sam Smith - Promises (Official Video)',
    channel: 'Calvin Harris',
    views: '130M views',
    createdAt: '10 months ago'
  }
];

function Media(props) {
  const { loading = false } = props;

  return (
    <Grid container wrap='nowrap'>
      {(loading ? Array.from(new Array(3)) : data).map((item, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
          {item ? (
            <img style={{ width: 210, height: 118 }} alt={item.title} src={item.src} />
          ) : (
            <Skeleton variant='rectangular' width={210} height={118} />
          )}

          {item ? (
            <Box sx={{ pr: 2 }}>
              <Text gutterBottom variant='body2'>
                {item.title}
              </Text>
              <Text display='block' variant='caption' color='text.secondary'>
                {item.channel}
              </Text>
              <Text variant='caption' color='text.secondary'>
                {`${item.views} • ${item.createdAt}`}
              </Text>
            </Box>
          ) : (
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width='60%' />
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
}

function YouTube() {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Media loading />
      <Media />
    </Box>
  );
}

function MediaTwo(props) {
  const { loading = false } = props;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton animation='wave' variant='circular' width={40} height={40} />
          ) : (
            <Avatar
              alt='Ted talk'
              src='https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg'
            />
          )
        }
        action={loading ? null : <IconButton aria-label='settings' icon='MdMoreVert' />}
        title={
          loading ? (
            <Skeleton animation='wave' height={10} width='80%' style={{ marginBottom: 6 }} />
          ) : (
            'Ted'
          )
        }
        subheader={loading ? <Skeleton animation='wave' height={10} width='40%' /> : '5 hours ago'}
      />
      {loading ? (
        <Skeleton sx={{ height: 190 }} animation='wave' variant='rectangular' />
      ) : (
        <CardMedia
          component='img'
          height='140'
          image='https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512'
          alt='Nicola Sturgeon on a TED talk stage'
        />
      )}

      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation='wave' height={10} width='80%' />
          </React.Fragment>
        ) : (
          <Text variant='body2' color='text.secondary' component='p'>
            {
              "Why First Minister of Scotland Nicola Sturgeon thinks GDP is the wrong measure of a country's success:"
            }
          </Text>
        )}
      </CardContent>
    </Card>
  );
}

function Facebook() {
  return (
    <div>
      <MediaTwo loading />
      <MediaTwo />
    </div>
  );
}

const variants = ['h1', 'h3', 'body1', 'caption'];

function TextDemo(props) {
  const { loading = false } = props;

  return (
    <div>
      {variants.map((variant) => (
        <Text component='div' key={variant} variant={variant}>
          {loading ? <Skeleton /> : variant}
        </Text>
      ))}
    </div>
  );
}

function SkeletonText() {
  return (
    <Grid container spacing={8}>
      <Grid xs>
        <TextDemo loading />
      </Grid>
      <Grid xs>
        <TextDemo />
      </Grid>
    </Grid>
  );
}

const Image = styled('img')({
  width: '100%'
});

function SkeletonChildrenDemo(props) {
  const { loading } = props;

  return (
    <Box width={350}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ margin: 1 }}>
          {loading ? (
            <Skeleton clasName='D' variant='circular'>
              <Avatar />
            </Skeleton>
          ) : (
            <Avatar src='https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg' />
          )}
        </Box>
        <Box sx={{ width: '100%' }}>
          {loading ? (
            <Skeleton clasName='R' width='100%'>
              <Text>.</Text>
            </Skeleton>
          ) : (
            <Text>Ted</Text>
          )}
        </Box>
      </Box>
      {loading ? (
        <Skeleton clasName='G' variant='rectangular' width='100%'>
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
      ) : (
        <Image
          width={350}
          src='https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512'
          alt=''
        />
      )}
    </Box>
  );
}

function SkeletonChildren() {
  return (
    <Grid container spacing={8}>
      <Grid xs>
        <SkeletonChildrenDemo loading />
      </Grid>
      <Grid xs>
        <SkeletonChildrenDemo />
      </Grid>
    </Grid>
  );
}

export default function ProgressDemo() {
  return (
    <>
      <Stack spacing={5} direction='column'>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Variants</Text>
          <Variants />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Animations</Text>
          <Animations />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Pulsate Example</Text>
          <YouTube />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Wave Example</Text>
          <Facebook />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Inferring Dimensions</Text>
          <SkeletonText />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Inferring Dimensions</Text>
          <SkeletonChildren />
        </Stack>
      </Stack>
    </>
  );
}
