import { Icon, Pagination, PaginationItem, Stack, Text } from '@components';
import React from 'react';

// import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const ArrowBackIcon = (props) => <Icon icon='MdArrowBack' {...props} />;
const ArrowForwardIcon = (props) => <Icon icon='MdArrowForward' {...props} />;

function BasicPagination() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} />
      <Pagination count={10} color='primary' />
      <Pagination count={10} color='secondary' />
      <Pagination count={10} disabled />
    </Stack>
  );
}

function PaginationOutlined() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} variant='outlined' />
      <Pagination count={10} variant='outlined' color='primary' />
      <Pagination count={10} variant='outlined' color='secondary' />
      <Pagination count={10} variant='outlined' disabled />
    </Stack>
  );
}

function PaginationRounded() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} shape='rounded' />
      <Pagination count={10} variant='outlined' shape='rounded' />
    </Stack>
  );
}

function PaginationSize() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} size='small' />
      <Pagination count={10} />
      <Pagination count={10} size='large' />
    </Stack>
  );
}
function PaginationButtons() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} showFirstButton showLastButton />
      <Pagination count={10} hidePrevButton hideNextButton />
    </Stack>
  );
}

function CustomIcons() {
  return (
    <Stack spacing={2}>
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
        )}
      />
    </Stack>
  );
}

function PaginationRanges() {
  return (
    <Stack spacing={2}>
      <Pagination count={11} defaultPage={6} siblingCount={0} />
      <Pagination count={11} defaultPage={6} /> {/* Default ranges */}
      <Pagination count={11} defaultPage={6} siblingCount={0} boundaryCount={2} />
      <Pagination count={11} defaultPage={6} boundaryCount={2} />
    </Stack>
  );
}

function PaginationControlled() {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Text>Page: {page}</Text>
      <Pagination count={10} page={page} onChange={handleChange} />
    </Stack>
  );
}

// function Content() {
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const page = parseInt(query.get('page') || '1', 10);
//   return (
//     <Pagination
//       page={page}
//       count={10}
//       renderItem={(item) => (
//         <PaginationItem
//           component={Link}
//           to={`/inbox${item.page === 1 ? '' : `?page=${item.page}`}`}
//           {...item}
//         />
//       )}
//     />
//   );
// }

// function PaginationLink() {
//   return (
//     <MemoryRouter initialEntries={['/inbox']} initialIndex={0}>
//       <Routes>
//         <Route path="*" element={<Content />} />
//       </Routes>
//     </MemoryRouter>
//   );
// }

export default function PaginationDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Pagination</Text>
        <BasicPagination />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Outlined Pagination</Text>
        <PaginationOutlined />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Rounded Pagination</Text>
        <PaginationRounded />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Pagination Sizes</Text>
        <PaginationSize />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Additional Pagination Buttons</Text>
        <PaginationButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Custom Pagination Icons</Text>
        <CustomIcons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Pagination Ranges</Text>
        <PaginationRanges />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled Pagination</Text>
        <PaginationControlled />
      </Stack>
      {/* <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Pagination Router Integration</Text>
        <PaginationLink />
      </Stack> */}
    </Stack>
  );
}
