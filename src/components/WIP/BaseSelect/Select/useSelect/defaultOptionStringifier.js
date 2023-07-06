const defaultOptionStringifier = (option) => {
  const { label, value } = option;
  if (typeof label === 'string') {
    return label;
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(option);
};

export default defaultOptionStringifier;
