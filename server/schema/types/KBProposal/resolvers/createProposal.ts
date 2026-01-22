import { builder } from '../../../builder'
import { KBProposalCreateInput } from '../inputs'

builder.mutationField('createProposal', (t) =>
  t.prismaField({
    type: 'KBProposal',
    args: {
      data: t.arg({ type: KBProposalCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBProposal.create({
        ...query,
        data: {
          statement: args.data.statement,
          status: args.data.status ?? undefined,
          testedBy: args.data.testedBy ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
