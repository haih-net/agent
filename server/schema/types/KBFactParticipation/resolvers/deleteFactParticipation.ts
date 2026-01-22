import { builder } from '../../../builder'

builder.mutationField('deleteFactParticipation', (t) =>
  t.prismaField({
    type: 'KBFactParticipation',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if participation exists and belongs to user (via fact)
      const existingParticipation =
        await ctx.prisma.kBFactParticipation.findFirst({
          where: {
            id: args.id,
            Fact: {
              createdById: ctx.currentUser.id,
            },
          },
        })

      if (!existingParticipation) {
        throw new Error('Fact participation not found or access denied')
      }

      return ctx.prisma.kBFactParticipation.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
