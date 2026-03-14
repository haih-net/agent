export interface PostValidationInput {
  title?: string | null
  description?: string | null
  intro?: string | null
  content: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationWarning {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

const LIMITS = {
  title: { max: 512, recommendedMin: 10, recommendedMax: 100 },
  description: { max: 3072, recommendedMin: 50, recommendedMax: 300 },
  content: { min: 1 },
}

export function validatePost(input: PostValidationInput): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  if (!input.content || input.content.trim().length === 0) {
    errors.push({ field: 'content', message: 'Content is required' })
  }

  if (input.title !== undefined && input.title !== null) {
    if (input.title.length > LIMITS.title.max) {
      errors.push({
        field: 'title',
        message: `Title exceeds maximum length of ${LIMITS.title.max} characters`,
      })
    }
    if (
      input.title.length > 0 &&
      input.title.length < LIMITS.title.recommendedMin
    ) {
      warnings.push({
        field: 'title',
        message: `Title is shorter than recommended ${LIMITS.title.recommendedMin} characters`,
      })
    }
    if (input.title.length > LIMITS.title.recommendedMax) {
      warnings.push({
        field: 'title',
        message: `Title exceeds recommended ${LIMITS.title.recommendedMax} characters for SEO`,
      })
    }
  }

  if (input.description !== undefined && input.description !== null) {
    if (input.description.length > LIMITS.description.max) {
      errors.push({
        field: 'description',
        message: `Description exceeds maximum length of ${LIMITS.description.max} characters`,
      })
    }
    if (
      input.description.length > 0 &&
      input.description.length < LIMITS.description.recommendedMin
    ) {
      warnings.push({
        field: 'description',
        message: `Description is shorter than recommended ${LIMITS.description.recommendedMin} characters`,
      })
    }
    if (input.description.length > LIMITS.description.recommendedMax) {
      warnings.push({
        field: 'description',
        message: `Description exceeds recommended ${LIMITS.description.recommendedMax} characters for SEO`,
      })
    }
  }

  if (!input.title && !input.description) {
    warnings.push({
      field: 'title',
      message: 'Consider adding a title for better discoverability',
    })
    warnings.push({
      field: 'description',
      message: 'Consider adding a description for SEO',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
