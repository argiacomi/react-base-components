import { css } from 'styled-components/macro'; //eslint-disable-line
import { Avatar, AvatarGroup, Icon, Stack } from '@components';

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const stringAvatar = (name) => ({
  style: {
    backgroundColor: stringToColor(name)
  },
  children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
});

export default function BackgroundLetterAvatars() {
  return (
    <Stack css={{ margin: '2rem 0' }} direction='row' spacing={2}>
      <Avatar {...stringAvatar('Kent Dodds')} />
      <Avatar {...stringAvatar('Jed Watson')} />
      <Avatar {...stringAvatar('Tim Neutkens')} />
      <Avatar>
        <Icon icon='MdFolder' />
      </Avatar>
      <Avatar css={{ backgroundColor: 'pink' }}>
        <Icon icon='MdPageview' />
      </Avatar>
      <Avatar css={{ backgroundColor: 'green' }}>
        <Icon icon='MdAssignment' />
      </Avatar>
      <AvatarGroup total={24}>
        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
        <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
        <Avatar alt='Agnes Walker' src='/static/images/avatar/4.jpg' />
        <Avatar alt='Trevor Henderson' src='/static/images/avatar/5.jpg' />
      </AvatarGroup>
    </Stack>
  );
}
