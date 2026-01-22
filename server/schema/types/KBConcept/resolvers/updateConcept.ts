import { builder } from '../../../builder'
import { KBConceptUpdateInput } from '../inputs'

builder.mutationField('updateConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBConceptUpdateInput, required: true }),
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

      return ctx.prisma.kBConcept.update({
        ...query,
        where: { id: args.id },
        data: {
          ...args.data,
          name: args.data.name ?? undefined,
        },
      })
    },
  }),
)
