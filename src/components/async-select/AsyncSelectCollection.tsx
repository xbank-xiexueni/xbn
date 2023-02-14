import { Box, Flex } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback } from 'react'
import { type GroupBase, type Props } from 'react-select'
import AsyncSelect from 'react-select/async'

import { apiGetActiveCollection } from '@/api'

import { EmptyComponent } from '..'

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
            top: '70%',
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
        IndicatorSeparator: () => null,
        NoOptionsMessage: () => <EmptyComponent my={0} mt={4} />,
      }}
      // @ts-ignore
      formatOptionLabel={({ col2, id }: Option) => (
        <Flex alignItems={'center'} key={id}>
          <Box w={4} h={4} bg='pink' />
          ----{col2}
        </Flex>
      )}
      {...rest}
    />
  )
}

export default AsyncSelectCollection
