import { builder } from '../../../builder'
import { EXReflexCreateInput } from '../inputs'

builder.mutationField('createReflex', (t) =>
  t.prismaField({
    type: 'EXReflex',
    args: {
      data: t.arg({ type: EXReflexCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.eXReflex.create({
        ...query,
        data: {
          type: args.data.type ?? undefined,
          status: args.data.status ?? undefined,
          stimulus: args.data.stimulus,
          response: args.data.response,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
