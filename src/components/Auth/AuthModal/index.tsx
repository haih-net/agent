import React, { useCallback, useState } from 'react'
import { Modal } from 'src/ui-kit/Modal'
import { SignInForm } from '../SignInForm'
import { SignUpForm } from '../SignUpForm'
import { AuthModalFooter, AuthModalLink } from './styles'

type AuthMode = 'signIn' | 'signUp'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signIn')

  const handleSwitchToSignUp = useCallback(() => {
    setMode('signUp')
  }, [])

  const handleSwitchToSignIn = useCallback(() => {
    setMode('signIn')
  }, [])

  const handleSuccess = useCallback(() => {
    onClose()
    setMode('signIn')
  }, [onClose])

  const title = mode === 'signIn' ? 'Sign In' : 'Sign Up'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {mode === 'signIn' ? (
        <>
          <SignInForm onSuccessHandler={handleSuccess} />
          <AuthModalFooter>
            Don&apos;t have an account?{' '}
            <AuthModalLink type="button" onClick={handleSwitchToSignUp}>
              Sign Up
            </AuthModalLink>
          </AuthModalFooter>
        </>
      ) : (
        <>
          <SignUpForm onSuccessHandler={handleSuccess} />
          <AuthModalFooter>
            Already have an account?{' '}
            <AuthModalLink type="button" onClick={handleSwitchToSignIn}>
              Sign In
            </AuthModalLink>
          </AuthModalFooter>
        </>
      )}
    </Modal>
  )
}
