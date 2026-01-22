import { builder } from '../../../builder'
import { KBLabelUpdateInput } from '../inputs'

builder.mutationField('updateLabel', (t) =>
  t.prismaField({
    type: 'KBLabel',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBLabelUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if label exists and belongs to user
      const existingLabel = await ctx.prisma.kBLabel.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingLabel) {
        throw new Error('Label not found or access denied')
      }

      return ctx.prisma.kBLabel.update({
        ...query,
        where: { id: args.id },
        data: {
          text: args.data.text ?? undefined,
          language: args.data.language ?? undefined,
          role: args.data.role ?? undefined,
        },
      })
    },
  }),
)
