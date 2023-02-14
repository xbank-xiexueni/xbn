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
        menuList(base) {
          return {
            ...base,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'var(--chakra-colors-blue-1)',
            boxShadow: '0px 2px 8px var(--chakra-colors-blue-2)',
            borderTop: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: 'white',
          }
        },
        menu(base) {
          return {
            ...base,
            border: 'none',
            borderRadius: 0,
            top: '66%',
            boxShadow: 'none',
          }
        },
        control: (baseStyles, { isFocused }) => ({
          ...baseStyles,
          width: 240,
          borderRadius: 8,
          border: `1px solid ${
            isFocused
              ? 'var(--chakra-colors-blue-1)'
              : 'var(--chakra-colors-blue-4)'
          }`,
          boxShadow: isFocused
            ? '0px 2px 8px var(--chakra-colors-blue-2)'
            : 'none',
          height: 44,
          backgroundColor: 'white',
          ':hover': {
            ...baseStyles[':hover'],
            borderColor: 'var(--chakra-colors-blue-1)',
          },
        }),
        option: (baseStyles, { isDisabled, isSelected, isFocused }) => ({
          ...baseStyles,
          backgroundColor: isSelected
            ? `var(--chakra-colors-blue-2)`
            : isFocused
            ? 'var(--chakra-colors-gray-5)'
            : 'white',
          color: `var(--chakra-colors-black-1)`,

          ':active': {
            ...baseStyles[':active'],
            backgroundColor: !isDisabled
              ? 'var(--chakra-colors-blue-2)'
              : undefined,
          },
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
