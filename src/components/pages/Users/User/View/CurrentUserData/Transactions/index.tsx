import React from 'react'
import { useRouter } from 'next/router'
import { useMyTransactionsWithCountQuery } from 'src/gql/generated'
import {
  TransactionsStyled,
  TransactionsHeaderStyled,
  TransactionsListStyled,
  TransactionsEmptyStyled,
} from './styles'
import { Pagination } from 'src/components/Pagination'
import { Transaction } from './Transaction'

const PAGE_SIZE = 10
const PAGE_PARAM = 'txPage'

export const Transactions: React.FC = () => {
  const router = useRouter()
  const currentPage = Number(router.query[PAGE_PARAM]) || 1

  const { data, loading } = useMyTransactionsWithCountQuery({
    variables: { skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE },
    fetchPolicy: 'cache-and-network',
  })

  const transactions = data?.myTransactions ?? []
  const totalCount = data?.myTransactionsCount ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    process.env.NEXT_PUBLIC_CRYPTO_ENABLED === 'true' && (
      <TransactionsStyled>
        <TransactionsHeaderStyled>Транзакции</TransactionsHeaderStyled>

        {transactions.length === 0 && !loading ? (
          <TransactionsEmptyStyled>Пока нет транзакций</TransactionsEmptyStyled>
        ) : (
          <TransactionsListStyled>
            {transactions.map((node) => (
              <Transaction key={node.id} node={node} />
            ))}
          </TransactionsListStyled>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageParam={PAGE_PARAM}
        />
      </TransactionsStyled>
    )
  )
}
