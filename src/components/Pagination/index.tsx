import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { PaginationStyled, PageButton, PageInfo } from './styles'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  pageParam?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageParam = 'page',
}) => {
  const router = useRouter()

  const handlePageChange = useCallback(
    (page: number) => {
      const query = { ...router.query, [pageParam]: String(page) }
      if (page === 1) {
        delete query[pageParam]
      }
      router.push({ pathname: router.pathname, query })
    },
    [router, pageParam],
  )

  const handlePrevPage = useCallback(() => {
    handlePageChange(currentPage - 1)
  }, [currentPage, handlePageChange])

  const handleNextPage = useCallback(() => {
    handlePageChange(currentPage + 1)
  }, [currentPage, handlePageChange])

  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationStyled>
      <PageButton disabled={currentPage <= 1} onClick={handlePrevPage}>
        Previous
      </PageButton>
      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
      <PageButton disabled={currentPage >= totalPages} onClick={handleNextPage}>
        Next
      </PageButton>
    </PaginationStyled>
  )
}
