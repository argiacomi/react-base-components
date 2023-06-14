import React from 'react';
import { styled } from '@styles';
import { Avatar, Box, Chip, Paper, Stack } from '@components';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function ColorChips() {
  const variants = ['filled', 'outlined'];
  const colors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
  const deleteIcons = ['MdDone', 'MdDelete', 'MdClose', 'MdRemove'];

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' }
  ]);

  const handleDeleteArray = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Stack direction='column' spacing={1}>
      <Paper
        css={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          padding: '0.5rem',
          margin: 0
        }}
        component='ul'
      >
        {chipData.map((data) => {
          let icon;

          if (data.label === 'React') {
            icon = 'MdTagFaces';
          }

          return (
            <ListItem key={data.key}>
              <Chip
                icon={icon}
                label={data.label}
                onDelete={data.label === 'React' ? undefined : handleDeleteArray(data)}
              />
            </ListItem>
          );
        })}
      </Paper>
      <Stack direction='row' spacing={1}>
        {variants.map((variant) => (
          <Chip key={variant} label={`Chip-${variant}`} variant={variant} />
        ))}
      </Stack>
      <Stack spacing={1} alignItems='center'>
        {variants.map((variant) => (
          <Stack key={variant} direction='row' spacing={1}>
            {colors.map((color) => (
              <Chip
                key={color}
                label={color}
                color={color}
                variant={variant}
                onClick={handleClick}
              />
            ))}
          </Stack>
        ))}
      </Stack>
      <Stack direction='row' spacing={1}>
        {variants.map((variant) => (
          <Chip key={variant} label={'Clickable'} variant={variant} onClick={handleClick} />
        ))}
      </Stack>
      <Stack direction='row' spacing={1}>
        {variants.map((variant) => (
          <Chip key={variant} label={'Deletable'} variant={variant} onDelete={handleDelete} />
        ))}
      </Stack>
      <Stack direction='row' spacing={1}>
        {variants.map((variant) => (
          <Chip
            key={variant}
            label={'Clickable Deletable'}
            variant={variant}
            onClick={handleClick}
            onDelete={handleDelete}
          />
        ))}
      </Stack>
      <Stack direction='row' spacing={1}>
        {variants.map((variant) => (
          <Chip
            key={variant}
            label={'Clickable Link'}
            component='a'
            href='#basic-chip'
            variant={variant}
            clickable
          />
        ))}
      </Stack>
      <Stack direction='column' spacing={1}>
        {variants.map((variant) => (
          <Stack key={variant} direction='row' spacing={1}>
            {deleteIcons.map((deleteIcon) => (
              <Chip
                key={deleteIcon}
                label={'Custom delete icon'}
                deleteIcon={deleteIcon}
                variant={variant}
                onClick={handleClick}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        ))}
      </Stack>
      <Stack direction='row' spacing={1}>
        <Chip avatar={<Avatar>M</Avatar>} label='Avatar' />
        <Chip avatar={<Avatar alt='Natacha' src='' />} label='Natacha' variant='outlined' />
      </Stack>
      <Stack direction='row' spacing={1}>
        <Chip icon={'MdFace'} label='With Icon' />
        <Chip icon={'MdFace'} label='With Icon' variant='outlined' />
      </Stack>
      <Stack spacing={1} alignItems='center'>
        {variants.map((variant) => (
          <Stack key={variant} direction='row' spacing={1}>
            {colors.map((color) => (
              <Chip
                key={color}
                label={'small'}
                size='small'
                color={color}
                variant={variant}
                onClick={handleClick}
              />
            ))}
          </Stack>
        ))}
      </Stack>
      <Box css={{ width: 100 }}>
        <Chip
          css={{
            height: 'auto',
            '& .Chip-Label': {
              display: 'block',
              whiteSpace: 'normal'
            }
          }}
          label='This is a chip that has multiple lines.'
        />
      </Box>
    </Stack>
  );
}
