import { Button } from '@components';

const ButtonDemo = () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'danger', 'default', 'inherit'];
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
        {sizes.map((size, index) => (
          <Button
            css={{ margin: '.5rem' }}
            key={index}
            size={size}
            variant='filled'
            color='primary'
          >
            {size} button
          </Button>
        ))}
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

export default ButtonDemo;
