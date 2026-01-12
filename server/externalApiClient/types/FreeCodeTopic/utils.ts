export const mapTopic = (topic: unknown) => {
  if (!topic) {
    return null
  }

  const res = topic as Record<string, unknown>

  return {
    ...topic,
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
