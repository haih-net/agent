import { builder } from '../../../builder'
import { KBProposalUpdateInput } from '../inputs'

builder.mutationField('updateProposal', (t) =>
  t.prismaField({
    type: 'KBProposal',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBProposalUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingProposal = await ctx.prisma.kBProposal.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingProposal) {
        throw new Error('Proposal not found or access denied')
      }

      return ctx.prisma.kBProposal.update({
        ...query,
        where: { id: args.id },
        data: {
          statement: args.data.statement ?? undefined,
          status: args.data.status ?? undefined,
          testedBy: args.data.testedBy ?? undefined,
        },
      })
    },
  }),
)
