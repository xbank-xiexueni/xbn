import { Flex } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback } from 'react'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'

import { apiGetActiveCollection, type CollectionListItemType } from '@/api'

import { EmptyComponent, ImageWithFallback, SvgComponent } from '..'

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

function AsyncSelectCollection({ ...rest }) {
  const { loading, data: collectionsData } = useRequest(
    apiGetActiveCollection,
    {
      debounceWait: 100,
      retryCount: 5,
    },
  )

  const promiseOptions = useCallback(
    (inputValue: string) =>
      new Promise<CollectionListItemType[]>((resolve) => {
        if (loading) {
          return
        }
        if (!inputValue) {
          return
        } else {
          resolve(
            collectionsData?.data?.filter((i: CollectionListItemType) =>
              i.name.toLowerCase().includes(inputValue.toLowerCase()),
            ) || [],
          )
        }
      }),
    [collectionsData, loading],
  )

  return (
    <AsyncSelect
      isLoading={loading}
      defaultOptions={collectionsData?.data || []}
      cacheOptions
      // @ts-ignore
      isOptionSelected={(item, select) => item.contract_addr === select}
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
      formatOptionLabel={({
        name,
        contract_addr,
        image_url,
        safelist_request_status,
      }: CollectionListItemType) => (
        <Flex alignItems={'center'} key={contract_addr} gap={2} pl={1}>
          <ImageWithFallback src={image_url} w={5} h={5} borderRadius={4} />
          {name?.length > 10 ? `${name?.substring(0, 10)}...` : name}
          {safelist_request_status === 'verified' && (
            <SvgComponent svgId='icon-verified-fill' />
          )}
        </Flex>
      )}
      {...rest}
    />
  )
}

export default AsyncSelectCollection
