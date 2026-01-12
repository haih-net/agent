import styled from 'styled-components'

const PromoStyled = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 40px;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
`

const FeatureCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.backgrounds.paper};
  text-align: left;
`

const FeatureTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 8px;
`

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const features = [
  {
    title: 'Next.js 16 + React 18',
    description:
      'Modern framework with SSR, ISR and App Router for maximum performance.',
  },
  {
    title: 'Apollo Client 4 + GraphQL',
    description:
      'Typed queries, caching, WebSocket subscriptions out of the box.',
  },
  {
    title: 'Prisma ORM 6',
    description:
      'Type-safe PostgreSQL operations, migrations and client generation.',
  },
  {
    title: 'Storybook 10',
    description: 'Isolated UI component development with auto-documentation.',
  },
  {
    title: 'Typed Linting',
    description:
      'ESLint 9 with TypeScript ESLint — catch deprecated APIs at dev time.',
  },
  {
    title: 'Auth + Permissions',
    description:
      'JWT authentication and graphql-shield for flexible access control.',
  },
]

export const Promo: React.FC = () => {
  return (
    <PromoStyled>
      <Title>Site Boilerplate</Title>
      <Subtitle>
        Ready-to-use foundation for quick web project starts on a modern stack
      </Subtitle>

      <FeatureGrid>
        {features.map((feature) => (
          <FeatureCard key={feature.title}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </PromoStyled>
  )
}
