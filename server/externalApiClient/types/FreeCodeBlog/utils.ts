export const mapBlog = (blog: unknown) => {
  if (!blog) {
    return null
  }

  const res = blog as Record<string, unknown>

  return {
    ...blog,
    createdAt:
      res.createdAt instanceof Date
        ? res.createdAt
        : new Date(res.createdAt as string),
    updatedAt:
      res.updatedAt instanceof Date
        ? res.updatedAt
        : new Date(res.updatedAt as string),
  }
}
