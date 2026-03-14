import { builder } from '../../../builder'
import { PostCreateInput } from '../inputs'
import { validatePost } from '../helpers/validate'
import { Post } from '@prisma/client'

builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      data: t.arg({ type: PostCreateInput, required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const { title, description, intro, content, status, parentId, ...other } =
        args.data

      const validation = validatePost({
        title,
        description,
        intro,
        content,
      })

      if (!validation.valid) {
        const errorMessages = validation.errors.map(
          (e) => `${e.field}: ${e.message}`,
        )
        throw new Error(`Validation failed: ${errorMessages.join('; ')}`)
      }

      let parent: Post | null

      if (parentId) {
        parent = await prisma.post.findUnique({
          where: {
            id: parentId,
          },
        })

        if (!parent) {
          throw new Error(`Can not get parent post`)
        }
      } else {
        parent = null
      }

      const post = await prisma.post.create({
        data: {
          title,
          description,
          intro,
          content,
          status: status ?? 'draft',
          createdById: currentUser.id,
          parentId,
          rootId: parent?.rootId ?? parent?.id,
          ...other,
        },
      })

      return post
    },
  }),
)
