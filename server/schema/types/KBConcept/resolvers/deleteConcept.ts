import { builder } from '../../../builder'

builder.mutationField('deleteConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if concept exists and belongs to user
      const existingConcept = await ctx.prisma.kBConcept.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingConcept) {
        throw new Error('Concept not found or access denied')
      }

      return ctx.prisma.kBConcept.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
