import React, { useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Separator } from './components/ui/Separator';
import { DrewButton } from './components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from './components/table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { makeData } from './lib/makeData';

export default function App(props) {
  const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'firstName',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id
          }
        ]
      },
      {
        header: 'Info',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'age',
            header: () => 'Age',
            footer: (props) => props.column.id
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id
              },
              {
                accessorKey: 'status',
                header: 'Status',
                footer: (props) => props.column.id
              },
              {
                accessorKey: 'progress',
                header: 'Profile Progress',
                footer: (props) => props.column.id
              }
            ]
          },
          {
            accessorKey: 'createdAt',
            header: 'Created At'
          }
        ]
      }
    ],
    []
  );

  const [data, setData] = useState(() => makeData(100000));
  const refreshData = () => setData(() => makeData(100000));

  const reactTable = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  return (
    <>
      <DrewButton className='m-4' variant='contain'>
        Drew
      </DrewButton>
      <DrewButton className='m-4' variant='text'>
        Drew
      </DrewButton>
      <DrewButton className='m-4' variant='outline'>
        Drew
      </DrewButton>
    </>
  );
}
