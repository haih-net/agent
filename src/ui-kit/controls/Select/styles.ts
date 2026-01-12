import styled from 'styled-components'
import { controlBaseStyles } from '../styles'

export const SelectStyled = styled.select`
  ${controlBaseStyles}
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23334155' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  cursor: pointer;
  appearance: none;
`
