import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SignInForm } from 'src/components/Auth/SignInForm'
import { SignInPageStyled } from './styles'

export const SignInPage: React.FC = () => {
  const router = useRouter()

  const handleSuccess = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <SignInPageStyled>
      <h1>Sign In</h1>
      <SignInForm onSuccessHandler={handleSuccess} />
    </SignInPageStyled>
  )
}
