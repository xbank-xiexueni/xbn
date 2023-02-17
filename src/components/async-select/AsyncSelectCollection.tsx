import { Flex, Image } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback } from 'react'
import { type GroupBase, type Props } from 'react-select'
import AsyncSelect from 'react-select/async'

import { apiGetActiveCollection } from '@/api'

import { EmptyComponent, SvgComponent } from '..'

function AsyncSelectCollection<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  ...rest
}: Props<Option, IsMulti, Group> & {
  // loadOptions: (inputValue: string) => Promise<Record<string, string>[]>
}) {
  const { loading, runAsync: handleFetchActiveCollections } = useRequest(
    apiGetActiveCollection,
    {
      manual: true,
    },
  )

  const promiseOptions = useCallback(
    (inputValue: string) => {
      console.log(inputValue, 'inputValue')
      return new Promise<any[]>((resolve) => {
        handleFetchActiveCollections()
          .then((res: { data: { list: any[] | PromiseLike<any[]> } }) => {
            resolve(res.data.list)
          })
          .catch((err: any) => console.log(err))
      })
    },
    [handleFetchActiveCollections],
  )
  return (
    <AsyncSelect
      isLoading={loading}
      defaultOptions
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
        menuList(base) {
          return {
            ...base,
            borderRadius: 8,
            border: '1px solid var(--chakra-colors-blue-1)',
            boxShadow:
              '-2px 2px 8px -6px var(--chakra-colors-blue-1), 2px 2px 8px -6px var(--chakra-colors-blue-1)',
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
            top: '68%',
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
            ? '-1px -1px 8px -6px var(--chakra-colors-blue-1), 1px -1px 8px -6px var(--chakra-colors-blue-1)'
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
        IndicatorSeparator: () => null,
        NoOptionsMessage: () => <EmptyComponent my={0} mt={4} />,
      }}
      // @ts-ignore
      formatOptionLabel={({ col2, id, img }: Option) => (
        <Flex alignItems={'center'} key={id}>
          <Image src={img} w={4} h={4} />
          ----名称是{col2}
          {id % 2 === 0 && <SvgComponent svgId='icon-verified-fill' />}
        </Flex>
      )}
      {...rest}
    />
  )
}

export default AsyncSelectCollection
