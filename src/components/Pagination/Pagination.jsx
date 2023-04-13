import React, { forwardRef } from 'react';
import { Button } from './Button';

const Pagination = forwardRef((props, ref) => {
	const {
		boundaryCount = 1,
		className,
		color = 'default',
		count = 1,
		defaultPage = 1,
		disabled = false,
		hideNextButton = false,
		hidePrevButton = false,
		onChange,
		page,
		renderItem = (item) => <PaginationItem {...item} />,
		shape = 'circular',
		showFirstButton = false,
		showLastButton = false,
		siblingCount = 1,
		size = 'medium',
		variant = 'text'
	} = props;

	const { items } = usePagination({
		boundaryCount,
		count,
		defaultPage,
		disabled,
		hideNextButton,
		hidePrevButton,
		onChange,
		page,
		showFirstButton,
		showLastButton,
		siblingCount
	});

	return (
		<nav className={className} ref={ref}>
			<ul>
				{items.map((item, index) => (
					<li key={index}>
						{renderItem({ ...item, color, shape, size, variant })}
					</li>
				))}
			</ul>
		</nav>
	);
});

Pagination.displayName = 'Pagination';

export { Pagination };
