import React, { useMemo, createContext, forwardRef } from 'react';
import TableContext from './TableContext';
import { cn } from '../../lib/utils';

const Table = forwardRef(
	(
		{
			className,
			Component = 'table',
			padding = 'default',
			size = 'md',
			stickyHeader = false,
			children,
			...otherProps
		},
		ref
	) => {
		const table = useMemo(
			() => ({
				padding,
				size,
				stickyHeader
			}),
			[padding, size, stickyHeader]
		);

		return (
			<TableContext.Provider value={table}>
				<Component
					className={cn('border-collapse', className)}
					ref={ref}
					{...otherProps}
				>
					{children}
				</Component>
			</TableContext.Provider>
		);
	}
);

export default Table;
