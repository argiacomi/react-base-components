import React, { forwardRef } from 'react';
import { PaginationItem } from './PaginationItem';

const Pagination = forwardRef(
	(
		{
			boundaryCount = 1,
			count = 1,
			defaultPage = 1,
			disabled = false,
			hideNextButton = false,
			hidePrevButton = false,
			onChange,
			page: controlledPage = null,
			showFirstButton = false,
			showLastButton = false,
			siblingCount = 1
		},
		ref
	) => {
		const [page, setPage] = React.useState(controlledPage || defaultPage);

		React.useEffect(() => {
			if (controlledPage !== undefined) {
				setPage(controlledPage);
			}
		}, [controlledPage]);

		const handleClick = (event, newPage) => {
			if (!disabled) {
				console.log('Ping 3');
				if (controlledPage === null) {
					console.log('Ping 4');
					setPage(newPage);
				}

				if (typeof onChange === 'function') {
					console.log('Ping 5');
					onChange(event, newPage);
				}
			}
		};

		const createPageItems = (start, end) => {
			const items = [];
			for (let pageNum = start; pageNum <= end; pageNum++) {
				items.push(
					<PaginationItem
						key={`page-${pageNum}`}
						page={pageNum}
						selected={pageNum === page}
						onClick={(event) => handleClick(event, pageNum)}
						disabled={disabled}
					/>
				);
			}
			return items;
		};

		const createEllipsis = (key) => (
			<PaginationItem key={key} type='ellipsis' disabled={disabled} />
		);

		const createFirstButton = () => (
			<PaginationItem
				key='first'
				type='first'
				onClick={(event) => handleClick(event, 1)}
				disabled={disabled}
			/>
		);

		const createLastButton = () => (
			<PaginationItem
				key='last'
				type='last'
				onClick={(event) => handleClick(event, count)}
				disabled={disabled}
			/>
		);

		const createPrevButton = () => (
			<PaginationItem
				key='previous'
				type='previous'
				onClick={(event) => handleClick(event, page - 1)}
				disabled={disabled}
			/>
		);

		const createNextButton = () => (
			<PaginationItem
				key='next'
				type='next'
				onClick={(event) => handleClick(event, page + 1)}
				disabled={disabled}
			/>
		);

		const paginationItems = [];

		if (showFirstButton) {
			paginationItems.push(createFirstButton());
		}

		if (!hidePrevButton) {
			paginationItems.push(createPrevButton());
		}

		let start = Math.max(1, page - siblingCount);
		let end = Math.min(count, page + siblingCount);

		if (start > boundaryCount + 2) {
			paginationItems.push(...createPageItems(1, boundaryCount));
			paginationItems.push(createEllipsis('start-ellipsis'));
		} else {
			end += boundaryCount + 1 - start;
			start = 1;
		}

		if (end < count - boundaryCount - 1) {
			paginationItems.push(...createPageItems(start, end));
			paginationItems.push(createEllipsis('end-ellipsis'));
			paginationItems.push(
				...createPageItems(count - boundaryCount + 1, count)
			);
		} else {
			start -= count - boundaryCount - end;
			end = count;
			paginationItems.push(...createPageItems(Math.max(1, start), end));
		}

		if (!hideNextButton) {
			paginationItems.push(createNextButton());
		}

		if (showLastButton) {
			paginationItems.push(createLastButton());
		}

		return (
			<nav aria-label='Pagination' ref={ref}>
				<ul className='pagination'>{paginationItems}</ul>
			</nav>
		);
	}
);

Pagination.displayName = 'Pagination';

export { Pagination };
