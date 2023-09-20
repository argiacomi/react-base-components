import { Breadcrumbs, Chip, Icon, Link, Stack, Text } from '@components';
import styled from '@styles';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

function BasicBreadcrumbs() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Src
        </Link>
        <Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
          Components
        </Link>
        <Text color='primary'>Breadcrumbs</Text>
      </Breadcrumbs>
    </div>
  );
}

function ActiveLastBreadcrumb() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Drew
        </Link>
        <Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
          Core
        </Link>
        <Link
          underline='hover'
          color='text.primary'
          href='/material-ui/react-breadcrumbs/'
          aria-current='page'
        >
          Breadcrumbs
        </Link>
      </Breadcrumbs>
    </div>
  );
}

function CustomSeparator() {
  const breadcrumbs = [
    <Link underline='hover' key='1' color='inherit' href='/' onClick={handleClick}>
      Drew
    </Link>,
    <Link
      underline='hover'
      key='2'
      color='inherit'
      href='/material-ui/getting-started/installation/'
      onClick={handleClick}
    >
      Core
    </Link>,
    <Text key='3' color='text.primary'>
      Breadcrumb
    </Text>
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator='›' aria-label='breadcrumb'>
        {breadcrumbs}
      </Breadcrumbs>
      <Breadcrumbs separator='-' aria-label='breadcrumb'>
        {breadcrumbs}
      </Breadcrumbs>
      <Breadcrumbs
        separator={<Icon icon='MdNavigateNext' fontSize='small' />}
        aria-label='breadcrumb'
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}

function IconBreadcrumbs() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link
          underline='hover'
          sx={{ display: 'flex', alignItems: 'center' }}
          color='inherit'
          href='/'
        >
          <Icon icon='MdHome' sx={{ mr: 0.5 }} fontSize='inherit' />
          Drew
        </Link>
        <Link
          underline='hover'
          sx={{ display: 'flex', alignItems: 'center' }}
          color='inherit'
          href='/material-ui/getting-started/installation/'
        >
          <Icon icon='MdWhatshot' sx={{ mr: 0.5 }} fontSize='inherit' />
          Core
        </Link>
        <Text sx={{ display: 'flex', alignItems: 'center' }} color='text.primary'>
          <Icon icon='MdGrain' sx={{ mr: 0.5 }} fontSize='inherit' />
          Breadcrumb
        </Text>
      </Breadcrumbs>
    </div>
  );
}

function CollapsedBreadcrumbs() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs maxItems={2} aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='#'>
          Home
        </Link>
        <Link underline='hover' color='inherit' href='#'>
          Catalog
        </Link>
        <Link underline='hover' color='inherit' href='#'>
          Accessories
        </Link>
        <Link underline='hover' color='inherit' href='#'>
          New Collection
        </Link>
        <Text color='text.primary'>Belts</Text>
      </Breadcrumbs>
    </div>
  );
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
  height: theme.spacing(3),
  color: theme.color.text.primary,
  fontWeight: theme.text.weight.normal,
  '&:hover, &:focus': {
    backgroundColor: theme.alpha.emphasize(theme.color.gray[100], 0.06)
  },
  '&:active': {
    boxShadow: theme.boxShadow[1],
    backgroundColor: theme.alpha.emphasize(theme.color.gray[100], 0.12)
  },
  '@media (prefers-color-scheme: dark)': {
    '&:hover, &:focus': {
      backgroundColor: theme.alpha.emphasize(theme.color.gray[800], 0.06)
    },
    '&:active': {
      boxShadow: theme.boxShadow[1],
      backgroundColor: theme.alpha.emphasize(theme.color.gray[800], 0.12)
    }
  }
}));

function CustomizedBreadcrumbs() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs aria-label='breadcrumb'>
        <StyledBreadcrumb
          component='a'
          href='#'
          label='Home'
          icon={<Icon icon='MdHome' fontSize='small' />}
        />
        <StyledBreadcrumb component='a' href='#' label='Catalog' />
        <StyledBreadcrumb
          label='Accessories'
          deleteIcon={<Icon icon='MdExpandMore' />}
          onDelete={handleClick}
        />
      </Breadcrumbs>
    </div>
  );
}

export default function BreadcrumbsDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Breadcrumbs</Text>
        <BasicBreadcrumbs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Active Last Breadcrumb</Text>
        <ActiveLastBreadcrumb />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Custom Separator</Text>
        <CustomSeparator />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Breadcrumbs with Icons</Text>
        <IconBreadcrumbs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Collapsed Breadcrumbs</Text>
        <CollapsedBreadcrumbs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Custom Breadcrumbs</Text>
        <CustomizedBreadcrumbs />
      </Stack>
    </Stack>
  );
}
