import React from 'react'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { KnowledgeBaseView } from './View'

export const KnowledgeBasePage: React.FC = () => {
  return (
    <>
      <SeoHeaders title="Knowledge Base" nofollow noindex />
      <KnowledgeBaseView />
    </>
  )
}
