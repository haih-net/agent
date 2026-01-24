import styled from 'styled-components'

export const ViewStyled = styled.div`
  padding: 24px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 32px;
    color: #1a1a1a;
  }
`

export const SectionStyled = styled.section`
  margin-bottom: 48px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #2a2a2a;
    border-bottom: 2px solid #e5e5e5;
    padding-bottom: 8px;
  }

  h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 12px 0 8px 0;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h5 {
    font-size: 12px;
    font-weight: 600;
    margin: 8px 0 6px 0;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
  }
`

export const NestedListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &.nested {
    gap: 8px;
    margin-left: 16px;
  }
`

export const EntityCardStyled = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d0d0d0;
    background: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &.nested-card {
    background: #ffffff;
    border-color: #f0f0f0;
    padding: 12px;

    &:hover {
      background: #fafafa;
      border-color: #e5e5e5;
    }
  }

  .entity-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;

    strong {
      font-size: 14px;
      color: #1a1a1a;
      flex: 1;
      min-width: 0;
      word-break: break-word;
    }
  }

  .entity-type {
    display: inline-block;
    background: #e8f4f8;
    color: #0066cc;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .role-badge {
    display: inline-block;
    background: #f0e8f8;
    color: #6b21a8;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .visibility-badge {
    display: inline-block;
    background: #f0f8e8;
    color: #166534;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .entity-description {
    margin: 8px 0 0 0;
    color: #666;
    font-size: 13px;
    line-height: 1.4;
  }

  .entity-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 8px 0;
    font-size: 12px;

    .meta-item {
      color: #777;

      strong {
        color: #1a1a1a;
        font-weight: 600;
      }
    }
  }

  .nested-section {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
`
