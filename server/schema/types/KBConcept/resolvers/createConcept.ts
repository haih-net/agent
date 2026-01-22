import { builder } from '../../../builder'
import { KBConceptCreateInput } from '../inputs'

builder.mutationField('createConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      data: t.arg({ type: KBConceptCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConcept.create({
        ...query,
        data: {
          ...args.data,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
