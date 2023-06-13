import React from 'react';
import { css } from 'styled-components/macro'; //eslint-disable-line
import { styled } from '@styles';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Icon,
  IconButton,
  Stack,
  Text
} from '@components';

const Bull = () => (
  <Box
    component='span'
    css={{
      display: 'inline-block',
      marginLeft: '2px',
      marginRight: '2px',
      transform: 'scale(0.8)'
    }}
  >
    •
  </Box>
);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transition.create('transform', {
    duration: theme.transition.duration.shortest
  })
}));

const SubCard = () => (
  <React.Fragment>
    <CardContent>
      <Text css={{ fontSize: 14 }} color='secondary' gutterBottom>
        Word of the Day
      </Text>
      <Text variant='h5' component='div'>
        be
        <Bull />
        nev
        <Bull />o<Bull />
        lent
      </Text>
      <Text css={{ marginBottom: 1.5 }} color='secondary'>
        adjective
      </Text>
      <Text variant='body2'>
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Text>
    </CardContent>
    <CardActions>
      <Button size='small'>Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export default function CardDemo() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Stack css={{ margin: '2rem 0' }} direction='column' spacing={2}>
      <Card css={{ minWidth: 275 }}>
        <CardContent>
          <Text css={{ fontSize: 14 }} color='secondary' gutterBottom>
            Word of the Day
          </Text>
          <Text variant='h5' component='div'>
            be
            <Bull />
            nev
            <Bull />o<Bull />
            lent
          </Text>
          <Text css={{ marginBottom: 1.5 }} color='secondary'>
            adjective
          </Text>
          <Text variant='body2'>
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Text>
        </CardContent>
        <CardActions>
          <Button size='small'>Learn More</Button>
        </CardActions>
      </Card>
      <Box css={{ minWidth: 275 }}>
        <Card variant='outlined'>
          <SubCard />
        </Card>
      </Box>
      <Card css={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar css={{ backgroundColor: 'red' }} aria-label='recipe'>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label='settings'>
              <Icon icon='MdMoreVert' />
            </IconButton>
          }
          title='Shrimp and Chorizo Paella'
          subheader='September 14, 2016'
        />
        <CardMedia
          component='img'
          height='194'
          image='/static/images/cards/paella.jpg'
          alt='Paella dish'
        />
        <CardContent>
          <Text variant='body2' color='secondary'>
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Text>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label='add to favorites'>
            <Icon icon='MdFavorite' />
          </IconButton>
          <IconButton aria-label='share'>
            <Icon icon='MdShare' />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <Icon icon='MdExpandMore' />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Text paragraph>Method:</Text>
            <Text paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
            </Text>
            <Text paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
              heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
              browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
              chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
              salt and pepper, and cook, stirring often until thickened and fragrant, about 10
              minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Text>
            <Text paragraph>
              Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
              without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
              to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
              cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
              minutes more. (Discard any mussels that don&apos;t open.)
            </Text>
            <Text>Set aside off of the heat to let rest for 10 minutes, and then serve.</Text>
          </CardContent>
        </Collapse>
      </Card>
      <Card css={{ maxWidth: 345 }}>
        <CardMedia
          css={{ height: 140 }}
          image='/static/images/cards/contemplative-reptile.jpg'
          title='green iguana'
        />
        <CardContent>
          <Text gutterBottom variant='h5' component='div'>
            Lizard
          </Text>
          <Text variant='body2' color='secondary'>
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Text>
        </CardContent>
        <CardActions>
          <Button size='small'>Share</Button>
          <Button size='small'>Learn More</Button>
        </CardActions>
      </Card>
      <Card css={{ maxWidth: 345 }}>
        <CardMedia
          component='img'
          alt='green iguana'
          height='140'
          image='/static/images/cards/contemplative-reptile.jpg'
        />
        <CardContent>
          <Text gutterBottom variant='h5' component='div'>
            Lizard
          </Text>
          <Text variant='body2' color='secondary'>
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Text>
        </CardContent>
        <CardActions>
          <Button size='small'>Share</Button>
          <Button size='small'>Learn More</Button>
        </CardActions>
      </Card>
      <Card css={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component='img'
            height='140'
            image='/static/images/cards/contemplative-reptile.jpg'
            alt='green iguana'
          />
          <CardContent>
            <Text gutterBottom variant='h5' component='div'>
              Lizard
            </Text>
            <Text variant='body2' color='secondary'>
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Text>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card css={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component='img'
            height='140'
            image='/static/images/cards/contemplative-reptile.jpg'
            alt='green iguana'
          />
          <CardContent>
            <Text gutterBottom variant='h5' component='div'>
              Lizard
            </Text>
            <Text variant='body2' color='secondary'>
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Text>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='primary'>
            Share
          </Button>
        </CardActions>
      </Card>
      <Card css={{ display: 'flex' }}>
        <Box css={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent css={{ flex: '1 0 auto' }}>
            <Text component='div' variant='h5'>
              Live From Space
            </Text>
            <Text variant='subtitle1' color='secondary' component='div'>
              Mac Miller
            </Text>
          </CardContent>
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '.5rem',
              paddingBottom: '.5rem'
            }}
          >
            <IconButton aria-label='previous'>
              <Icon icon='MdSkipPrevious' />
            </IconButton>
            <IconButton aria-label='play/pause'>
              <Icon icon='MdPlayArrow' scssx={{ height: 38, width: 38 }} />
            </IconButton>
            <IconButton aria-label='next'>
              <Icon icon='MdSkipNext' />
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          component='img'
          css={{ width: 151 }}
          image='/static/images/cards/live-from-space.jpg'
          alt='Live from space album cover'
        />
      </Card>
    </Stack>
  );
}
