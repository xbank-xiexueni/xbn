import { Box, Flex } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback } from 'react'
import AsyncSelect from 'react-select/async'

import { apiGetActiveCollection } from '@/api'
import COLORS from '@/utils/Colors'

import type { GroupBase, Props } from 'react-select'

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
      console.log(inputValue)
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
      className='react-select-container'
      defaultOptions
      // @ts-ignore
      isOptionSelected={(item, select) => item.id === select}
      loadOptions={promiseOptions}
      theme={(theme) => ({ ...theme, borderRadius: 0, width: 240 })}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          width: 240,
          borderRadius: 8,
          height: 44,
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isSelected ? COLORS.secondaryColor : 'white',
          color: COLORS.textColor,
        }),
      }}
      components={{
        IndicatorSeparator: () => null,
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
