import {
  Box,
  Heading,
  Tabs,
  TabPanel,
  TabList,
  Tab,
  TabPanels,
  Tag,
  // Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import range from 'lodash-es/range'

import {
  MyAssetNftListCard,
  // SearchInput, Select
} from '@/components'

const MyAssets = () => {
  return (
    <Box>
      <Heading mt={'60px'} mb={14}>
        My Assets
      </Heading>
      <Tabs position='relative'>
        <TabList
          _active={{
            color: 'blue.1',
            fontWeight: 'bold',
          }}
        >
          <Tab
            pt='16px'
            px={'4px'}
            pb={'20px'}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
          >
            Collected &nbsp;
            <Tag
              bg='blue.1'
              color='white'
              borderRadius={15}
              fontSize={'12px'}
              h={'20px'}
            >
              10
            </Tag>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* <Flex justify={'space-between'} mb='24px' mt={'40px'}>
              <Box w='70%'>
                <SearchInput />
              </Box>
              <Select
                options={[
                  {
                    label: 'Price: low to high',
                    value: 1,
                  },
                ]}
                defaultValue={{
                  label: 'Price: low to high',
                  value: 1,
                }}
              />
            </Flex> */}
            <SimpleGrid minChildWidth='330px' spacing={'16px'} mt={'40px'}>
              {range(15).map((item) => (
                <MyAssetNftListCard data={{}} key={item} onClick={() => {}} />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default MyAssets
