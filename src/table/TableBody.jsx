import React, { createContext, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import Tablelvl2Context from './Tablelvl2Context';

const TableBody = forwardRef(
	({ children, className, Component = 'tbody', ...other }, ref) => {
		return (
			<Tablelvl2Context.Provider value={{ variant: 'body' }}>
				<Component
					className={cn(className, 'table-row-group')}
					ref={ref}
					{...other}
				>
					{children}
				</Component>
			</Tablelvl2Context.Provider>
		);
	}
);

TableBody.displayName = 'TableBody';

export default TableBody;
