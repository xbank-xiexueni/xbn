import { Box, Flex } from '@chakra-ui/react'
import range from 'lodash/range'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'

import type { GroupBase, Props } from 'react-select'

function generateList(l: number): Promise<Record<string, string>[]> {
  const res = range(l || 10).map((item) => ({
    value: item.toString(),
    label: `${item}- xxn `,
  }))
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res)
    }, 1000)
  })
}
const promiseOptions = (inputValue: string) => {
  console.log(inputValue, '11111')
  return generateList(10)
}

function AsyncSelectCollection<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  ...rest
}: Props<Option, IsMulti, Group> & {
  // loadOptions: (inputValue: string) => Promise<Record<string, string>[]>
}) {
  return (
    <AsyncSelect
      cacheOptions
      // defaultOptions
      // @ts-ignore
      loadOptions={promiseOptions}
      theme={(theme) => ({ ...theme, borderRadius: 0, width: 240 })}
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
        Control: ({ children, ...rest1 }) => (
          <components.Control {...rest1}>
            {/* <Image src={img} ml={3} /> */}
            {children}
          </components.Control>
        ),
      }}
      formatOptionLabel={({ label, value }: Option) => (
        <Flex alignItems={'center'}>
          <Box w={4} h={4} bg='pink' />
          {label}----{value}
        </Flex>
      )}
      {...rest}
    />
  )
}

export default AsyncSelectCollection
