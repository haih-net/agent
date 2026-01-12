import { useAppContext } from 'src/components/AppContext'
import { Button, ButtonProps } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import React, { useCallback } from 'react'

export type SignOutButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const SignOutButton: React.FC<SignOutButtonProps> = (props) => {
  const { onSignOut } = useAppContext()

  const handleSignOut = useCallback(async () => {
    await onSignOut?.()
  }, [onSignOut])

  return (
    <Button
      variant={ComponentVariant.SECONDARY}
      onClick={handleSignOut}
      {...props}
    >
      Sign Out
    </Button>
  )
}
