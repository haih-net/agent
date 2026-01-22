import { builder } from '../../../builder'
import { KBProposalOrderByInput, KBProposalWhereInput } from '../inputs'

builder.queryField('myProposals', (t) =>
  t.prismaField({
    type: ['KBProposal'],
    args: {
      where: t.arg({ type: KBProposalWhereInput }),
      orderBy: t.arg({ type: KBProposalOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBProposal.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          status: args.where?.status ?? undefined,
          testedBy: args.where?.testedBy ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          status: args.orderBy?.status ?? undefined,
        },
      })
    },
  }),
)
