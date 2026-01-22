import { builder } from '../../../builder'

builder.mutationField('deleteProposal', (t) =>
  t.prismaField({
    type: 'KBProposal',
    args: {
      id: t.arg.string({ required: true }),
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

      return ctx.prisma.kBProposal.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
