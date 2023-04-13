import React from 'react';

const TablePagination = ({
	currentPage,
	totalPages,
	onPageChange,
	limit,
	onLimitChange
}) => {
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage);
		}
	};

	const handleLimitChange = (event) => {
		onLimitChange(parseInt(event.target.value, 10));
	};

	return (
		<div className='my-4 flex items-center justify-between'>
			<button
				className='rounded-l bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400'
				onClick={() => handlePageChange(currentPage - 1)}
			>
				Prev
			</button>
			<div className='mx-4'>
				Page {currentPage} of {totalPages}
			</div>
			<button
				className='rounded-r bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400'
				onClick={() => handlePageChange(currentPage + 1)}
			>
				Next
			</button>
			<div className='ml-4'>
				<label htmlFor='limit' className='mr-2'>
					Items per page:
				</label>
				<select
					name='limit'
					id='limit'
					value={limit}
					onChange={handleLimitChange}
					className='rounded border border-gray-300 bg-white px-4 py-2'
				>
					<option value='5'>5</option>
					<option value='10'>10</option>
					<option value='25'>25</option>
					<option value='50'>50</option>
				</select>
			</div>
		</div>
	);
};

TablePagination.displayName = 'TablePagination';

export default TablePagination;
