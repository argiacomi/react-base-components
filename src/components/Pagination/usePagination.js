function usePagination({
	boundaryCount = 1,
	count = 1,
	defaultPage = 1,
	disabled = false,
	hideNextButton = false,
	hidePrevButton = false,
	onChange,
	page,
	showFirstButton = false,
	showLastButton = false,
	siblingCount = 1
}) {
	const currentPage = page || defaultPage;

	const handleClick = (event, newPage) => {
		if (!disabled && onChange) {
			onChange(event, newPage);
		}
	};

	const range = (start, end) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, i) => start + i);
	};

	const startPages = range(1, Math.min(boundaryCount, count));
	const endPages = range(
		Math.max(count - boundaryCount + 1, boundaryCount + 1),
		count
	);

	const siblingsStart = Math.max(
		Math.min(
			currentPage - siblingCount,
			count - boundaryCount - siblingCount * 2 - 1
		),
		boundaryCount + 2
	);

	const siblingsEnd = Math.min(
		Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
		endPages[0] - 2
	);

	const siblingPages = range(siblingsStart, siblingsEnd);

	const items = [
		...(!hidePrevButton && [
			{
				onClick: (event) => handleClick(event, currentPage - 1),
				type: 'previous',
				disabled
			}
		]),
		...(showFirstButton && [
			...startPages,
			...(siblingsStart - boundaryCount > 2 && [{ type: 'start-ellipsis' }])
		]),
		...siblingPages,
		...(count - boundaryCount - siblingsEnd > 1 && [{ type: 'end-ellipsis' }]),
		...(showLastButton && [...endPages]),
		...(!hideNextButton && [
			{
				onClick: (event) => handleClick(event, currentPage + 1),
				type: 'next',
				disabled
			}
		])
	].map((item, index) => {
		if (typeof item === 'number') {
			return {
				onClick: (event) => handleClick(event, item),
				type: 'page',
				page: item,
				selected: item === currentPage,
				disabled
			};
		}
		return item;
	});

	return { items };
}
