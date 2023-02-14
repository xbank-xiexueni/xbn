import Select, { components, type GroupBase, type Props } from 'react-select'

export interface ColorOption {
  readonly value: string
  readonly label: string
  readonly color: string
  readonly isFixed?: boolean
  readonly isDisabled?: boolean
}

function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  img,
  ...restProps
}: Props<Option, IsMulti, Group> & { img?: React.ReactElement }) {
  return (
    <Select
      {...restProps}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        width: 240,
        colors: {
          ...theme.colors,
          primary: `var(--chakra-colors-blue-1)`,
        },
      })}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          width: 240,
          borderRadius: 8,
          height: 44,
          borderColor: state.isFocused
            ? `var(--chakra-colors-blue-1)`
            : `var(--chakra-colors-gray-2)`,
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isSelected
            ? `var(--chakra-colors-blue-2)`
            : 'white',
          color: `var(--chakra-colors-black-1)`,
        }),
      }}
      components={{
        Control: ({ children, ...rest }) => (
          <components.Control {...rest}>
            {img}
            {children}
          </components.Control>
        ),
        IndicatorSeparator: () => null,
      }}
    />
  )
}

export default CustomSelect
