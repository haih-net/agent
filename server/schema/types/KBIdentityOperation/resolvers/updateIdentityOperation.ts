import { builder } from '../../../builder'
import { KBIdentityOperationUpdateInput } from '../inputs'

builder.mutationField('updateIdentityOperation', (t) =>
  t.prismaField({
    type: 'KBIdentityOperation',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBIdentityOperationUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingOperation = await ctx.prisma.kBIdentityOperation.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingOperation) {
        throw new Error('Identity operation not found or access denied')
      }

      const updateData: Record<string, unknown> = {
        operation: args.data.operation ?? undefined,
        rationale: args.data.rationale ?? undefined,
      }

      // Handle inputIds update
      if (args.data.inputIds !== undefined && args.data.inputIds !== null) {
        const inputIds = args.data.inputIds
        // Verify all input concepts belong to user
        const inputConcepts = await ctx.prisma.kBConcept.findMany({
          where: {
            id: { in: inputIds },
            createdById: ctx.currentUser.id,
          },
        })

        if (inputConcepts.length !== inputIds.length) {
          throw new Error(
            'One or more input concepts not found or access denied',
          )
        }

        updateData.Inputs = {
          set: inputIds.map((id: string) => ({ id })),
        }
      }

      // Handle outputIds update
      if (args.data.outputIds !== undefined && args.data.outputIds !== null) {
        const outputIds = args.data.outputIds
        // Verify all output concepts belong to user
        const outputConcepts = await ctx.prisma.kBConcept.findMany({
          where: {
            id: { in: outputIds },
            createdById: ctx.currentUser.id,
          },
        })

        if (outputConcepts.length !== outputIds.length) {
          throw new Error(
            'One or more output concepts not found or access denied',
          )
        }

        updateData.Outputs = {
          set: outputIds.map((id: string) => ({ id })),
        }
      }

      return ctx.prisma.kBIdentityOperation.update({
        ...query,
        where: { id: args.id },
        data: updateData,
      })
    },
  }),
)
