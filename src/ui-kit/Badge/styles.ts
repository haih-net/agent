import styled from 'styled-components'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { buttonBaseStyles } from '../Button/styles'

export type BadgeVariant = ComponentVariant
export type BadgeSize = ComponentSize

interface BadgeStyledProps {
  $variant: BadgeVariant
  $size: BadgeSize
}

export const BadgeStyled = styled.span<BadgeStyledProps>`
  ${buttonBaseStyles};

  border-radius: ${({ theme }) => theme.radii.full};
`
