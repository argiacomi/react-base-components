import React, { useRef, useCallback, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
	'relative border-none inline-flex items-center justify-center rounded-md overflow-hidden transition-colors focus:outline-none cursor-pointer hover:scale-105 font-medium drop-shadow-md',
	{
		variants: {
			color: {
				default: 'bg-inherit text-white',
				primary: 'bg-primary text-white',
				secondary: 'bg-secondary text-white',
				success: 'bg-success text-white',
				warning: 'bg-warning text-white',
				danger: 'bg-danger text-white',
				monochrome: 'bg-white text-black border border-solid border-black'
			},
			variant: {
				text: 'bg-opacity-0 border-none text-black dark:text-white',
				outline: 'bg-opacity-0 border border-solid border-current'
			},
			size: {
				xs: 'px-2 py-1 leading-4 text-xs w-auto min-w-[64px]',
				sm: 'px-3 py-1 leading-4 text-sm w-auto min-w-[64px]',
				md: 'px-3 py-1 leading-6 text-base w-auto min-w-[64px]',
				lg: 'px-5 py-1 leading-7 text-lg w-auto min-w-[64px]',
				xl: 'px-7 py-2 leading-8 text-xl w-auto min-w-[64px]'
			},
			disabled: {
				true: 'pointer-events-none bg-gray-100 text-gray-400 dark:bg-gray-300 dark:text-gray-600'
			}
		},
		compoundVariants: [
			{
				variant: 'text',
				color: 'default',
				className: 'text-text dark:text-darkText'
			},
			{
				variant: 'outline',
				color: 'default',
				className: 'text-text dark:text-darkText'
			},
			{
				variant: 'outline',
				color: 'primary',
				className: 'text-primary'
			},
			{
				variant: 'outline',
				color: 'secondary',
				className: 'text-secondary'
			},
			{
				variant: 'outline',
				color: 'success',
				className: 'text-success'
			},
			{
				variant: 'outline',
				color: 'warning',
				className: 'text-warning'
			},
			{
				variant: 'outline',
				color: 'danger',
				className: 'text-danger'
			},
			{
				variant: 'outline',
				color: 'monochrome',
				className: 'text-monochrome'
			},
			{
				variant: ['text', 'outline'],
				color: 'default',
				className: 'dark:hover:text-gray-300 hover:bg-gray-100/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'primary',
				className: 'dark:hover:text-primary hover:bg-primary/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'secondary',
				className: 'dark:hover:text-secondary hover:bg-secondary/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'success',
				className: 'dark:hover:text-success hover:bg-success/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'warning',
				className: 'dark:hover:text-warning hover:bg-warning/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'danger',
				className: 'dark:hover:text-danger hover:bg-danger/30'
			},
			{
				variant: ['text', 'outline'],
				color: 'monochrome',
				className:
					'dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 hover:bg-opacity-30'
			}
		],
		defaultVariants: {
			color: 'default',
			size: 'md'
		}
	}
);

const Button = React.forwardRef(
	(
		{ className, color, variant, size, fullWidth, disabled, onClick, ...props },
		ref
	) => {
		const rippleTimeoutRef = useRef(null);

		const createRipple = useCallback((event) => {
			const button = event.currentTarget;

			const circle = document.createElement('span');
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = `${diameter}px`;
			circle.style.height = `${diameter}px`;
			circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
			circle.classList.add('ripple');

			const ripple = button.querySelector('.ripple');

			if (ripple) {
				ripple.remove();
			}

			button.appendChild(circle);

			rippleTimeoutRef.current = setTimeout(() => {
				circle.remove();
			}, 650);
		}, []);

		useEffect(() => {
			return () => {
				if (rippleTimeoutRef.current !== null) {
					clearTimeout(rippleTimeoutRef.current);
				}
			};
		}, [rippleTimeoutRef]);

		return (
			<button
				onClick={(e) => {
					if (typeof onClick === 'function') onClick(e);
					createRipple(e);
				}}
				className={cn(
					buttonVariants({
						color,
						variant,
						size,
						fullWidth,
						disabled,
						className
					})
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
