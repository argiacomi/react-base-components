export const SwitchSlider = styled.span.attrs(() => ({ 'data-test-id': 'budget-slider' }))<{
  disabled?: boolean
  isLarge?: boolean
}>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.disabled ? props.theme.color.interactiveHovered : props.theme.color.interactiveDefault};
  border: 1px solid ${({ theme }) => theme.color.inputBorderDefault};
  border-radius: ${({ theme }) => theme.space(8)};
  transition: 0.1s;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  &:before {
    position: absolute;
    content: '';
    width: ${({ theme, isLarge }) => (isLarge ? theme.space(4.5) : theme.space(3))};
    height: ${({ theme, isLarge }) => (isLarge ? theme.space(4.5) : theme.space(3))};
    top: ${({ isLarge }) => (isLarge ? '2px' : '1px')};
    left: ${({ isLarge }) => (isLarge ? '2px' : '1px')};
    background-color: ${({ theme, disabled }) => (disabled ? theme.color.iconDisabled : theme.color.iconSubdued)};
    border-radius: 50%;
    transition: 0.1s;
  }
`

export const SwitchInput = styled.input<{ isLarge?: boolean }>`
  &:checked + ${SwitchSlider} {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.color.interactiveHovered : theme.color.backgroundBoldPrimary};
  }
  &:focus + ${SwitchSlider} {
    box-shadow: 0 0 3px
      ${({ theme, disabled }) => (disabled ? theme.color.interactiveHovered : theme.color.backgroundBoldPrimary)};
  }
  &:checked + ${SwitchSlider}:before {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.color.iconDisabled : theme.color.iconOnDarkBackground};
    top: ${({ isLarge }) => (isLarge ? '2px' : '1px')};
    left: ${({ isLarge }) => (isLarge ? '2px' : '1px')};
    transform: translateX(calc(100% + 4px));
  }
`
