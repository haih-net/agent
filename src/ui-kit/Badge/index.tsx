import React from 'react'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { BadgeStyled, BadgeVariant, BadgeSize } from './styles'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = ComponentVariant.DEFAULT,
  size = ComponentSize.SM,
}) => {
  return (
    <BadgeStyled $variant={variant} $size={size}>
      {children}
    </BadgeStyled>
  )
}
