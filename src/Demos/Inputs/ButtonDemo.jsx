import { Button, Icon, IconButton, Stack, Text } from '@components';

const ButtonDemoIteration = () => {
  const colors = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'monochrome',
    'default',
    'inherit'
  ];
  const sizes = ['mini', 'small', 'medium', 'large', 'jumbo', 'auto'];
  const variants = ['text', 'outlined', 'filled', 'colorText'];

  return (
    <div>
      <div>
        {colors.map((color, index) => (
          <Button css={{ margin: '.5rem' }} key={index} color={color} variant='filled'>
            {color} button
          </Button>
        ))}
      </div>
      <div>
        {sizes.map((size) =>
          variants.map((variant, index) => (
            <Button
              css={{ margin: '.5rem' }}
              key={index}
              size={size}
              variant={variant}
              color='primary'
            >
              {size} button
            </Button>
          ))
        )}
      </div>
      <div>
        {variants.map((variant, index) => (
          <Button css={{ margin: '.5rem' }} key={index} variant={variant} color='primary'>
            {variant} button
          </Button>
        ))}
      </div>
      <div>
        {variants.map((variant, index) => (
          <Button css={{ margin: '.5rem' }} key={index} variant={variant} disabled>
            {variant} disabled
          </Button>
        ))}
      </div>
    </div>
  );
};

function IconLabelButtons() {
  return (
    <Stack direction='row' spacing={2}>
      <Button variant='filled' color='primary' startIcon='MdDelete'>
        Delete
      </Button>
      <Button variant='filled' color='primary' endIcon='MdSend'>
        Send
      </Button>
    </Stack>
  );
}

function IconButtons() {
  return (
    <Stack direction='row' spacing={1}>
      <IconButton aria-label='delete' icon='MdDelete' />
      <IconButton aria-label='delete' disabled color='primary' icon='MdDelete' />
      <IconButton color='secondary' aria-label='add an alarm' icon='MdAlarm' />
      <IconButton color='primary' aria-label='add to shopping cart' icon='MdAddShoppingCart' />
    </Stack>
  );
}

function IconButtonSizes() {
  return (
    <Stack direction='row' alignItems='center' spacing={1}>
      <IconButton aria-label='delete' icon='MdDelete' size='mini' />
      <IconButton aria-label='delete' icon='MdDelete' size='small' fontSize={20} />
      <IconButton aria-label='delete' icon='MdDelete' />
      <IconButton aria-label='delete' icon='MdDelete' size='large' />
      <IconButton aria-label='delete' icon='MdDelete' size='jumbo' />
    </Stack>
  );
}

function IconButtonSizesMui() {
  return (
    <Stack direction='row' alignItems='center' spacing={1}>
      <IconButton aria-label='delete' size='small'>
        <Icon icon='MdDelete' size='inherit' />
      </IconButton>
      <IconButton aria-label='delete' size='small'>
        <Icon icon='MdDelete' size='small' />
      </IconButton>
      <IconButton aria-label='delete' size='large'>
        <Icon icon='MdDelete' />
      </IconButton>
      <IconButton aria-label='delete' size='large'>
        <Icon icon='MdDelete' size='inherit' />
      </IconButton>
    </Stack>
  );
}

function IconButtonColors() {
  return (
    <Stack direction='row' spacing={1}>
      <IconButton aria-label='fingerprint' color='secondary'>
        <Icon icon='MdFingerprint' />
      </IconButton>
      <IconButton aria-label='fingerprint' color='success'>
        <Icon icon='MdFingerprint' />
      </IconButton>
    </Stack>
  );
}

export default function ButtonDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Standard Buttons Props</Text>
        <ButtonDemoIteration />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Style Override</Text>
        <IconLabelButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Buttons</Text>
        <IconButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Button Sizes</Text>
        <IconButtonSizes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Button Sizes - MUI</Text>
        <IconButtonSizesMui />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Colored Icon Buttons</Text>
        <IconButtonColors />
      </Stack>
    </Stack>
  );
}
