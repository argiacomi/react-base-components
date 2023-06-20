import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Icon,
  Stack,
  Text
} from '@components';
import { List, ListItem } from '@components/Display/useList';

function BasicList() {
  return (
    <Box
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 350,
        backgroundColor: theme.color.background
      })}
    >
      <nav aria-label='main mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon icon='MdInbox' />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon icon='MdDrafts' />
              </ListItemIcon>
              <ListItemText primary='Drafts' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label='secondary mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary='Trash' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component='a' href='#simple-list'>
              <ListItemText primary='Spam' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}

export default function NewListDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Basic List</Text>
        <BasicList />
      </Stack>
    </Stack>
  );
}
