import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Paper } from './components';
import { Filter, ArrowDown } from 'lucide-react';
import {
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell
} from './components/Table';

import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { makeData } from './lib/makeData';

export default function FullTable() {
	const rerender = React.useReducer(() => ({}), {})[1];
	const [sorting, setSorting] = React.useState([]);

	const columns = React.useMemo(
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
					}
				]
			}
		],
		[]
	);

	const [data, setData] = React.useState(() => makeData(25));
	const refreshData = () => setData(() => makeData(25));

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
		<div className='grid w-fit'>
			<div className='mr-4 justify-self-end'>
				<Button modifier='text' className='text-black'>
					<Filter className={'ml-1 h-4 w-4'} />
					<span>Filter</span>
				</Button>
			</div>
			<TableContainer className='m-4' component={Paper}>
				<Table padding='dense'>
					<TableHead>
						{reactTable.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableCell key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort()
															? 'inline-flex items-center justify-start hover:text-text focus:text-text cursor-pointer select-none'
															: 'inline-flex items-center justify-start',
														onClick: header.column.getToggleSortingHandler()
													}}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: <ArrowDown className={'ml-1 h-4 w-4'} />,
														desc: (
															<ArrowDown
																className={'ml-1 h-4 w-4 rotate-180'}
															/>
														)
													}[header.column.getIsSorted()] ?? null}
												</div>
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{reactTable
							.getRowModel()
							.rows.slice(0, 10)
							.map((row) => {
								return (
									<TableRow hover key={row.id}>
										{row.getVisibleCells().map((cell) => {
											return (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				<div>{reactTable.getRowModel().rows.length} Rows</div>
				<div>
					<button onClick={() => rerender()}>Force Rerender</button>
				</div>
				<div>
					<button onClick={() => refreshData()}>Refresh Data</button>
				</div>
				<pre>{JSON.stringify(sorting, null, 2)}</pre>
			</TableContainer>
		</div>
	);
}
