import { builder } from '../../../builder'
import { KBLabelCreateInput } from '../inputs'

builder.mutationField('createLabel', (t) =>
  t.prismaField({
    type: 'KBLabel',
    args: {
      data: t.arg({ type: KBLabelCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Verify that the concept belongs to the user
      const concept = await ctx.prisma.kBConcept.findFirst({
        where: {
          id: args.data.conceptId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!concept) {
        throw new Error('Concept not found or access denied')
      }

      return ctx.prisma.kBLabel.create({
        ...query,
        data: {
          conceptId: args.data.conceptId,
          text: args.data.text,
          language: args.data.language ?? undefined,
          role: args.data.role ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
