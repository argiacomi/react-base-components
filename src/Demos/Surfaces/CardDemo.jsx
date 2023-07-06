import React from 'react';
import styled, { useTheme } from '@styles';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Icon,
  IconButton,
  Stack,
  Text
} from '@components';

const bull = (
  <Box component='span' sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

function BasicCard() {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 275 }}>
      <CardContent>
        <Text sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Word of the Day
        </Text>
        <Text variant='h5' component='div'>
          be{bull}nev{bull}o{bull}lent
        </Text>
        <Text sx={{ mb: 1.5 }} color='text.secondary'>
          adjective
        </Text>
        <Text variant='body2'>
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Text>
      </CardContent>
      <CardActions>
        <Button variant='colorText' size='small'>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

const card = (
  <React.Fragment>
    <CardContent>
      <Text sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
        Word of the Day
      </Text>
      <Text variant='h5' component='div'>
        be{bull}nev{bull}o{bull}lent
      </Text>
      <Text sx={{ mb: 1.5 }} color='text.secondary'>
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

function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275, maxWidth: 275 }}>
      <Card outlined>{card}</Card>
    </Box>
  );
}

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

function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red' }} aria-label='recipe'>
            R
          </Avatar>
        }
        action={<IconButton aria-label='settings' icon='MdMoreVert' />}
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
        <Text variant='body2' color='text.secondary'>
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Text>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='add to favorites' icon='MdFavorite' />
        <IconButton aria-label='share' icon='MdShare' />
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
          icon='MdExpandMore'
        />
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
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Text>
          <Text paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
            again without stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Text>
          <Text>Set aside off of the heat to let rest for 10 minutes, and then serve.</Text>
        </CardContent>
      </Collapse>
    </Card>
  );
}

function MediaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image='/static/images/cards/contemplative-reptile.jpg'
        title='green iguana'
      />
      <CardContent>
        <Text gutterBottom variant='h5' component='div'>
          Lizard
        </Text>
        <Text variant='body2' color='text.secondary'>
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica
        </Text>
      </CardContent>
      <CardActions>
        <Button variant='colorText' size='small'>
          Share
        </Button>
        <Button variant='colorText' size='small'>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

function ImgMediaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
        <Text variant='body2' color='text.secondary'>
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica
        </Text>
      </CardContent>
      <CardActions>
        <Button variant='colorText' size='small'>
          Share
        </Button>
        <Button variant='colorText' size='small'>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

function ActionAreaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
          <Text variant='body2' color='text.secondary'>
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Text>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MultiActionAreaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
          <Text variant='body2' color='text.secondary'>
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Text>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button variant='colorText' size='small' color='primary'>
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

function MediaControlCard() {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto', minWidth: 206 }}>
          <Text component='div' variant='h5'>
            Live From Space
          </Text>
          <Text variant='subtitle1' color='text.secondary' component='div'>
            Mac Miller
          </Text>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label='previous'>
            {theme.direction === 'rtl' ? (
              <Icon icon='MdSkipNext' />
            ) : (
              <Icon icon='MdSkipPrevious' />
            )}
          </IconButton>
          <IconButton aria-label='play/pause'>
            <Icon icon='MdPlayArrow' sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label='next'>
            {theme.direction === 'rtl' ? (
              <Icon icon='MdSkipPrevious' />
            ) : (
              <Icon icon='MdSkipNext' />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component='img'
        sx={{ width: 151 }}
        image='/static/images/cards/live-from-space.jpg'
        alt='Live from space album cover'
      />
    </Card>
  );
}

export default function CardDemo() {
  return (
    <Stack width='fit-content' spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Card</Text>
        <BasicCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Outlined Card</Text>
        <OutlinedCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Complex Interaction</Text>
        <RecipeReviewCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Media Card 1</Text>
        <MediaCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Media Card 2</Text>
        <ImgMediaCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Primary Action</Text>
        <ActionAreaCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Multi Action</Text>
        <MultiActionAreaCard />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>UI Controls</Text>
        <MediaControlCard />
      </Stack>
    </Stack>
  );
}
