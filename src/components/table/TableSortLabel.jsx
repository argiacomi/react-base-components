import React, { forwardRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const TableSortLabel = forwardRef(
	(
		{
			active = false,
			children,
			className,
			direction = 'asc',
			hideSortIcon = false,
			...other
		},
		ref
	) => {
		const iconClasses = cn('transition-transform', {
			'text-opacity-0': hideSortIcon && !active,
			'rotate-0': direction === 'asc',
			'rotate-180': direction === 'desc'
		});

		return (
			<Button
				ref={ref}
				variant='primary'
				modifier='text'
				className={cn(
					'inline-flex cursor-pointer items-center justify-start hover:text-secondary focus:text-secondary active:text-primary',
					className
				)}
				{...other}
			>
				<span>{children}</span>
				{active || !hideSortIcon ? (
					<ArrowDown
						className={cn('mr-1 h-4 w-4 active:text-secondary', iconClasses)}
					/>
				) : null}
			</Button>
		);
	}
);

TableSortLabel.displayName = 'TableSortLabel';

export default TableSortLabel;
