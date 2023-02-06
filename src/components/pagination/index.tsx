import Pagination, { type PaginationProps } from 'rc-pagination'

import './index.less'

import type { FunctionComponent } from 'react'

const index: FunctionComponent<PaginationProps> = ({
  total,
  defaultCurrent = 1,
  ...rest
}) => {
  return (
    <Pagination
      className='ant-pagination'
      defaultCurrent={defaultCurrent}
      total={total}
      {...rest}
    />
  )
  // return (
  //   <ReactPaginate
  //     breakLabel='...'
  //     nextLabel='>'
  //     onPageChange={onPageChange}
  //     pageRangeDisplayed={pageRangeDisplayed}
  //     pageCount={pageCount}
  //     previousLabel='<'
  //     renderOnZeroPageCount={() => null}
  //     containerClassName='paginate-container'
  //     pageClassName='page-class'
  //     pageLinkClassName='page-link-class'
  //     activeClassName='active-class'
  //     activeLinkClassName='active-link-class'
  //     previousLinkClassName='previous-link-class'
  //     nextLinkClassName='next-link-class'
  //     nextClassName='next-class'
  //     {...rest}
  //   />
  // )
}

export default index
