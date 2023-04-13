import { useContext, forwardRef } from 'react';
import Tablelvl2Context from './Tablelvl2Context';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const rowVariants = cva('bg-opacity-0 text-black dark:text-white', {
	variants: {
		color: {
			default: '',
			primary: '',
			secondary: '',
			success: '',
			warning: '',
			danger: '',
			monochrome: ''
		},
		hover: {
			true: 'cursor-pointer',
			false: ''
		},
		selected: {
			true: '',
			false: ''
		}
	},
	compoundVariants: [
		{
			color: 'default',
			hover: true,
			className: 'hover:bg-gray-200/30'
		},
		{
			color: 'primary',
			hover: true,
			className: 'hover:bg-primary/30'
		},
		{
			color: 'secondary',
			hover: true,
			className: 'hover:bg-secondary/30'
		},
		{
			color: 'success',
			hover: true,
			className: 'hover:bg-success/30'
		},
		{
			color: 'warning',
			hover: true,
			className: 'hover:bg-warning/30'
		},
		{
			color: 'danger',
			hover: true,
			className: 'hover:bg-danger/30'
		},
		{
			color: 'monochrome',
			hover: true,
			className: 'hover:bg-black/30 dark:hover:bg-white/30'
		}
	],
	defaultVariants: {
		color: 'default',
		hover: false,
		selected: false
	}
});

const TableRow = forwardRef(
	({ className, color, Component = 'tr', hover, selected, ...other }, ref) => {
		const context = useContext(Tablelvl2Context);
		const isHead = context.variant === 'head';
		const isFooter = context.variant === 'footer';

		return (
			<Component
				ref={ref}
				className={cn(
					isHead || isFooter
						? 'bg-opacity-0 text-black dark:text-white'
						: rowVariants({ color, hover, selected, className }),
					isHead
						? 'border-collapse border-0 border-b border-solid'
						: 'border-collapse border-x-0 border-y border-solid last:border-b-0',
					'border-Text dark:border-darkText'
				)}
				{...other}
			/>
		);
	}
);

TableRow.displayName = 'TableRow';

export default TableRow;
