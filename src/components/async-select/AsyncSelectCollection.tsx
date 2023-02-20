import { Flex, Image } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback } from 'react'
import { components, type GroupBase, type Props } from 'react-select'
import AsyncSelect from 'react-select/async'

import { apiGetActiveCollection } from '@/api'

import { EmptyComponent, SvgComponent } from '..'

const Option = ({ children, isSelected, ...props }: any) => {
  return (
    <components.Option isSelected={isSelected} {...props}>
      <Flex justify={'space-between'} alignItems='center'>
        {children}
        <SvgComponent
          svgId={isSelected ? 'icon-radio-active' : 'icon-radio-inactive'}
        />
      </Flex>
    </components.Option>
  )
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
  const { loading, data } = useRequest(apiGetActiveCollection)

  const promiseOptions = useCallback(
    (inputValue: string) =>
      new Promise<any[]>((resolve) => {
        if (!inputValue) {
          return
        }
        resolve(
          data?.data?.list?.filter((i: any) =>
            i.col1.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        )
      }),
    [data],
  )

  return (
    <AsyncSelect
      isLoading={loading}
      defaultOptions={data?.data?.list}
      cacheOptions
      // @ts-ignore
      isOptionSelected={(item, select) => item.id === select}
      loadOptions={promiseOptions}
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
        placeholder: (base) => ({
          ...base,
          color: 'var(--chakra-colors-black-1)',
          fontWeight: 700,
        }),
        menuList(base) {
          return {
            ...base,
            borderRadius: 8,
            border: '1px solid var(--chakra-colors-blue-1)',
            // boxShadow:
            //   '-2px 1px 4px -3px var(--chakra-colors-blue-1),2px 2px 3px -3px var(--chakra-colors-blue-1)',
            borderTop: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: 'white',
            paddingTop: 20,
          }
        },
        menu(base) {
          return {
            ...base,
            border: 'none',
            borderRadius: 0,
            top: '65%',
            boxShadow: 'none',
          }
        },
        control: (baseStyles, { isFocused }) => ({
          ...baseStyles,
          width: 240,
          fontWeight: 700,
          borderRadius: 8,
          border: `1px solid ${
            isFocused
              ? 'var(--chakra-colors-blue-1)'
              : 'var(--chakra-colors-blue-4)'
          }`,
          boxShadow: 'none',
          // boxShadow: isFocused
          //   ? '-2px 1px 4px -3px var(--chakra-colors-blue-1), 2px -2px 4px -3px var(--chakra-colors-blue-1)'
          //   : 'none',
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
          fontSize: 14,
          fontWeight: 500,

          ':active': {
            ...baseStyles[':active'],
            backgroundColor: !isDisabled
              ? 'var(--chakra-colors-blue-2)'
              : undefined,
          },
        }),
      }}
      components={{
        IndicatorSeparator: () => null,
        NoOptionsMessage: () => <EmptyComponent my={0} mt={4} />,
        Option,
      }}
      // @ts-ignore
      formatOptionLabel={({ col1, id, img }: Option) => (
        <Flex alignItems={'center'} key={id} gap={2}>
          <Image src={img} w={4} h={4} />
          {`${col1}`.length > 10 ? `${`${col1}`.substring(0, 10)}...` : col1}
          {id % 2 === 0 && <SvgComponent svgId='icon-verified-fill' />}
        </Flex>
      )}
      {...rest}
    />
  )
}

export default AsyncSelectCollection
