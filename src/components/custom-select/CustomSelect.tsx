import { Image } from '@chakra-ui/react'
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
>({ img, ...restProps }: Props<Option, IsMulti, Group> & { img?: string }) {
  // const colorStyles: StylesConfig<
  //   StylesConfig<ColorOption, boolean, GroupBase<ColorOption>>
  // > = useMemo(
  //   () => ({
  //     control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  //     option: (styles, { data, isDisabled, isFocused, isSelected }) => {
  //       return {
  //         ...styles,
  //         width,
  //         cursor: isDisabled ? 'not-allowed' : 'default',
  //       }
  //     },
  //     input: (styles) => ({ ...styles, ...dot() }),
  //     placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
  //     // singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  //   }),
  //   [width],
  // )
  console.log(restProps)
  return (
    <Select
      {...restProps}
      theme={(theme) => ({ ...theme, borderRadius: 0, width: 240 })}
      // styles={colorStyles}
      // styles={[{}]}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          width: 240,
          borderRadius: 8,
          height: 44,
        }),
        input: (styles) => ({ ...styles }),
      }}
      components={{
        Control: ({ children, ...rest }) => (
          <components.Control {...rest}>
            <Image src={img} ml={3} />
            {children}
          </components.Control>
        ),
      }}
    />
  )
}

export default CustomSelect
