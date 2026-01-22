import { builder } from '../../../builder'
import { KBIdentityOperationCreateInput } from '../inputs'

builder.mutationField('createIdentityOperation', (t) =>
  t.prismaField({
    type: 'KBIdentityOperation',
    args: {
      data: t.arg({ type: KBIdentityOperationCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Verify that all input concepts belong to the user
      const inputConcepts = await ctx.prisma.kBConcept.findMany({
        where: {
          id: { in: args.data.inputIds },
          createdById: ctx.currentUser.id,
        },
      })

      if (inputConcepts.length !== args.data.inputIds.length) {
        throw new Error('One or more input concepts not found or access denied')
      }

      // Verify that all output concepts belong to the user
      const outputConcepts = await ctx.prisma.kBConcept.findMany({
        where: {
          id: { in: args.data.outputIds },
          createdById: ctx.currentUser.id,
        },
      })

      if (outputConcepts.length !== args.data.outputIds.length) {
        throw new Error(
          'One or more output concepts not found or access denied',
        )
      }

      return ctx.prisma.kBIdentityOperation.create({
        ...query,
        data: {
          operation: args.data.operation,
          rationale: args.data.rationale ?? undefined,
          createdById: ctx.currentUser.id,
          Inputs: {
            connect: args.data.inputIds.map((id: string) => ({ id })),
          },
          Outputs: {
            connect: args.data.outputIds.map((id: string) => ({ id })),
          },
        },
      })
    },
  }),
)
