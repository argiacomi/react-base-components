import { Text, Breadcrumbs, Link } from '@components';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs() {
  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Drew
        </Link>
        <Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
          Core
        </Link>
        <Text color='primary'>Breadcrumbs</Text>
      </Breadcrumbs>
    </div>
  );
}
