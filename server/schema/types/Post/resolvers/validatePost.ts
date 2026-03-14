import { builder } from '../../../builder'
import { validatePost } from '../helpers/validate'

const ValidationErrorType = builder.simpleObject('PostValidationError', {
  fields: (t) => ({
    field: t.string(),
    message: t.string(),
  }),
})

const ValidationWarningType = builder.simpleObject('PostValidationWarning', {
  fields: (t) => ({
    field: t.string(),
    message: t.string(),
  }),
})

const PostValidationResult = builder.simpleObject('PostValidationResult', {
  fields: (t) => ({
    valid: t.boolean(),
    errors: t.field({ type: [ValidationErrorType] }),
    warnings: t.field({ type: [ValidationWarningType] }),
  }),
})

const ValidatePostInput = builder.inputType('ValidatePostInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    intro: t.string({ required: false }),
    content: t.string({ required: true }),
  }),
})

builder.queryField('validatePost', (t) =>
  t.field({
    type: PostValidationResult,
    args: {
      data: t.arg({ type: ValidatePostInput, required: true }),
    },
    resolve: (_root, args) => {
      return validatePost({
        title: args.data.title,
        description: args.data.description,
        intro: args.data.intro,
        content: args.data.content,
      })
    },
  }),
)
