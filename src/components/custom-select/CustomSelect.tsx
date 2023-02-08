import { Image } from '@chakra-ui/react'
import Select, { components, type GroupBase, type Props } from 'react-select'

import COLORS from '@/utils/Colors'
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
>({ img, ...restProps }: Props<Option, IsMulti, Group> & { img?: string }) {
  return (
    <Select
      {...restProps}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        width: 240,
        colors: {
          ...theme.colors,
          primary: COLORS.primaryColor,
        },
      })}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          width: 240,
          borderRadius: 8,
          height: 44,
          borderColor: state.isFocused
            ? COLORS.primaryColor
            : COLORS.borderColor,
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isSelected ? COLORS.secondaryColor : 'white',
          color: COLORS.textColor,
        }),
      }}
      components={{
        Control: ({ children, ...rest }) => (
          <components.Control {...rest}>
            <Image src={img} ml={3} />
            {children}
          </components.Control>
        ),
        IndicatorSeparator: () => null,
      }}
    />
  )
}

export default CustomSelect
