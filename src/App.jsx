import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Button } from './components/ui';
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

export default function App() {
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

	const [data, setData] = React.useState(() => makeData(100000));
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
		<TableContainer padding='dense' className={'m-4 p-2'}>
			<Table>
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
														? 'cursor-pointer select-none'
														: '',
													onClick: header.column.getToggleSortingHandler()
												}}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{{
													asc: ' 🔼',
													desc: ' 🔽'
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
								<TableRow key={row.id}>
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
				<Button onClick={() => rerender()}>Force Rerender</Button>
			</div>
			<div>
				<Button onClick={() => refreshData()}>Refresh Data</Button>
			</div>
			<pre>{JSON.stringify(sorting, null, 2)}</pre>
		</TableContainer>
	);
}
