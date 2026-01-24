import React, { useMemo } from 'react'
import {
  useMyConceptsQuery,
  useMyFactsQuery,
  useMyFactParticipationsQuery,
  useMyKnowledgeSpacesQuery,
  useMyFactProjectionsQuery,
  MyConceptsQuery,
  MyFactsQuery,
  MyFactParticipationsQuery,
  MyFactProjectionsQuery,
} from 'src/gql/generated'
import {
  ViewStyled,
  SectionStyled,
  EntityCardStyled,
  NestedListStyled,
} from './styles'

interface EnrichedFact {
  fact: NonNullable<MyFactsQuery['response']>[0]
  participations: NonNullable<MyFactParticipationsQuery['response']>
  projections: NonNullable<MyFactProjectionsQuery['response']>
}

interface EnrichedConcept {
  concept: NonNullable<MyConceptsQuery['response']>[0]
  participatingFacts: EnrichedFact[]
}

export const KnowledgeBaseView: React.FC = () => {
  const { data: conceptsData, loading: conceptsLoading } = useMyConceptsQuery()
  const { data: factsData, loading: factsLoading } = useMyFactsQuery()
  const { data: participationsData, loading: participationsLoading } =
    useMyFactParticipationsQuery()
  const { data: knowledgeSpacesData, loading: spacesLoading } =
    useMyKnowledgeSpacesQuery()
  const { data: projectionsData, loading: projectionsLoading } =
    useMyFactProjectionsQuery()

  const loading =
    conceptsLoading ||
    factsLoading ||
    participationsLoading ||
    spacesLoading ||
    projectionsLoading

  const enrichedData = useMemo(() => {
    const concepts = conceptsData?.response || []
    const facts = factsData?.response || []
    const participations = participationsData?.response || []
    const spaces = knowledgeSpacesData?.response || []
    const projections = projectionsData?.response || []

    const enrichedFacts: Map<string, EnrichedFact> = new Map()
    facts.forEach((fact) => {
      if (fact.id) {
        enrichedFacts.set(fact.id, {
          fact,
          participations: participations.filter((p) => p.factId === fact.id),
          projections: projections.filter((p) => p.factId === fact.id),
        })
      }
    })

    const enrichedConcepts: EnrichedConcept[] = concepts.map((concept) => ({
      concept,
      participatingFacts: participations
        .filter((p) => p.conceptId === concept.id)
        .map((p) => enrichedFacts.get(p.factId || ''))
        .filter((f) => f !== undefined) as EnrichedFact[],
    }))

    return {
      concepts: enrichedConcepts,
      facts: Array.from(enrichedFacts.values()),
      spaces,
    }
  }, [
    conceptsData,
    factsData,
    participationsData,
    knowledgeSpacesData,
    projectionsData,
  ])

  if (loading) {
    return <ViewStyled>Loading knowledge base...</ViewStyled>
  }

  return (
    <ViewStyled>
      <h1>Knowledge Base</h1>

      <SectionStyled>
        <h2>Knowledge Spaces ({enrichedData.spaces.length})</h2>
        {enrichedData.spaces.length > 0 ? (
          <NestedListStyled>
            {enrichedData.spaces.map((space) => (
              <EntityCardStyled key={space.id}>
                <div className="entity-header">
                  <strong>{space.name}</strong>
                  <span className="entity-type">{space.type}</span>
                </div>
                {space.description && (
                  <p className="entity-description">{space.description}</p>
                )}
              </EntityCardStyled>
            ))}
          </NestedListStyled>
        ) : (
          <p>No knowledge spaces found</p>
        )}
      </SectionStyled>

      <SectionStyled>
        <h2>Concepts ({enrichedData.concepts.length})</h2>
        {enrichedData.concepts.length > 0 ? (
          <NestedListStyled>
            {enrichedData.concepts.map((enriched) => (
              <EntityCardStyled key={enriched.concept.id}>
                <div className="entity-header">
                  <strong>{enriched.concept.name}</strong>
                  <span className="entity-type">{enriched.concept.type}</span>
                </div>
                {enriched.concept.description && (
                  <p className="entity-description">
                    {enriched.concept.description}
                  </p>
                )}

                {enriched.participatingFacts.length > 0 && (
                  <div className="nested-section">
                    <h4>
                      Participating Facts ({enriched.participatingFacts.length})
                    </h4>
                    <NestedListStyled className="nested">
                      {enriched.participatingFacts.map((enrichedFact) => (
                        <EntityCardStyled
                          key={enrichedFact.fact.id}
                          className="nested-card"
                        >
                          <div className="entity-header">
                            <strong>{enrichedFact.fact.statement}</strong>
                            <span className="entity-type">
                              {enrichedFact.fact.type}
                            </span>
                          </div>
                          <div className="entity-meta">
                            <span className="meta-item">
                              Confidence:{' '}
                              <strong>{enrichedFact.fact.confidence}</strong>
                            </span>
                            <span className="meta-item">
                              Status:{' '}
                              <strong>{enrichedFact.fact.status}</strong>
                            </span>
                            {enrichedFact.fact.validFrom && (
                              <span className="meta-item">
                                Valid from:{' '}
                                <strong>
                                  {new Date(
                                    enrichedFact.fact.validFrom,
                                  ).toLocaleDateString()}
                                </strong>
                              </span>
                            )}
                          </div>

                          {enrichedFact.participations.length > 0 && (
                            <div className="nested-section">
                              <h5>Participations</h5>
                              <NestedListStyled className="nested">
                                {enrichedFact.participations.map(
                                  (participation) => (
                                    <EntityCardStyled
                                      key={participation.id}
                                      className="nested-card"
                                    >
                                      <div className="entity-header">
                                        <span className="role-badge">
                                          {participation.role}
                                        </span>
                                      </div>
                                      {participation.value && (
                                        <p className="entity-description">
                                          Value: {participation.value}
                                        </p>
                                      )}
                                      {participation.impact && (
                                        <p className="entity-description">
                                          Impact: {participation.impact}
                                        </p>
                                      )}
                                      {participation.localImportance !==
                                        null && (
                                        <p className="entity-description">
                                          Importance:{' '}
                                          {participation.localImportance}
                                        </p>
                                      )}
                                    </EntityCardStyled>
                                  ),
                                )}
                              </NestedListStyled>
                            </div>
                          )}

                          {enrichedFact.projections.length > 0 && (
                            <div className="nested-section">
                              <h5>
                                Projections ({enrichedFact.projections.length})
                              </h5>
                              <NestedListStyled className="nested">
                                {enrichedFact.projections.map((projection) => (
                                  <EntityCardStyled
                                    key={projection.id}
                                    className="nested-card"
                                  >
                                    <div className="entity-header">
                                      <span className="visibility-badge">
                                        {projection.visibility}
                                      </span>
                                    </div>
                                    <div className="entity-meta">
                                      {projection.trustLevel !== null && (
                                        <span className="meta-item">
                                          Trust:{' '}
                                          <strong>
                                            {projection.trustLevel}
                                          </strong>
                                        </span>
                                      )}
                                      {projection.importance !== null && (
                                        <span className="meta-item">
                                          Importance:{' '}
                                          <strong>
                                            {projection.importance}
                                          </strong>
                                        </span>
                                      )}
                                    </div>
                                    {projection.notes && (
                                      <p className="entity-description">
                                        {projection.notes}
                                      </p>
                                    )}
                                  </EntityCardStyled>
                                ))}
                              </NestedListStyled>
                            </div>
                          )}
                        </EntityCardStyled>
                      ))}
                    </NestedListStyled>
                  </div>
                )}
              </EntityCardStyled>
            ))}
          </NestedListStyled>
        ) : (
          <p>No concepts found</p>
        )}
      </SectionStyled>

      <SectionStyled>
        <h2>All Facts ({enrichedData.facts.length})</h2>
        {enrichedData.facts.length > 0 ? (
          <NestedListStyled>
            {enrichedData.facts.map((enrichedFact) => (
              <EntityCardStyled key={enrichedFact.fact.id}>
                <div className="entity-header">
                  <strong>{enrichedFact.fact.statement}</strong>
                  <span className="entity-type">{enrichedFact.fact.type}</span>
                </div>
                <div className="entity-meta">
                  <span className="meta-item">
                    Confidence: <strong>{enrichedFact.fact.confidence}</strong>
                  </span>
                  <span className="meta-item">
                    Status: <strong>{enrichedFact.fact.status}</strong>
                  </span>
                  {enrichedFact.fact.source && (
                    <span className="meta-item">
                      Source: <strong>{enrichedFact.fact.source}</strong>
                    </span>
                  )}
                </div>
              </EntityCardStyled>
            ))}
          </NestedListStyled>
        ) : (
          <p>No facts found</p>
        )}
      </SectionStyled>
    </ViewStyled>
  )
}
