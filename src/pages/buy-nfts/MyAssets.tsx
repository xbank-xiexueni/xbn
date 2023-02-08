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
import range from 'lodash/range'

import {
  MyAssetNftListCard,
  // SearchInput, Select
} from '@/components'
import COLORS from '@/utils/Colors'

const MyAssets = () => {
  return (
    <Box>
      <Heading mt={'60px'} mb={14}>
        My Assets
      </Heading>
      <Tabs position='relative'>
        <TabList
          _active={{
            color: COLORS.primaryColor,
            fontWeight: 'bold',
          }}
        >
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: COLORS.primaryColor,
              borderBottomWidth: 2,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            Collected &nbsp;
            <Tag
              bg={COLORS.primaryColor}
              color='white'
              borderRadius={15}
              fontSize={'xs'}
              h={5}
            >
              10
            </Tag>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* <Flex justify={'space-between'} mb={6} mt={10}>
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
            <SimpleGrid minChildWidth='330px' spacing={'16px'} mt={10}>
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
