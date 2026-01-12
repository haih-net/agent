import styled from 'styled-components'

export const AuthModalFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export const AuthModalLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`
