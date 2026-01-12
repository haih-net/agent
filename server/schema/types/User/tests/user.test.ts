import { describe, expect, it } from 'vitest'
import { print } from 'graphql'
import {
  UsersConnectionDocument,
  UsersConnectionQuery,
} from 'src/gql/generated/usersConnection'
import { MeDocument, MeQuery } from 'src/gql/generated/me'
import {
  SignupDocument,
  SignupMutation,
  SignupMutationVariables,
} from 'src/gql/generated/signup'
import {
  SigninDocument,
  SigninMutation,
  SigninMutationVariables,
} from 'src/gql/generated/signin'
import {
  UpdateCurrentUserDocument,
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables,
} from 'src/gql/generated/updateCurrentUser'
import { graphqlRequest } from 'server/tests/api/setup/testClient'

describe('User API (e2e)', () => {
  it('returns users list', async () => {
    const res = await graphqlRequest<UsersConnectionQuery>(
      print(UsersConnectionDocument),
    )

    expect(res.errors).toBeUndefined()
    expect(res.data?.users).toBeDefined()
    expect(typeof res.data?.usersCount).toBe('number')
  })

  it('me is null when not authenticated', async () => {
    const res = await graphqlRequest<MeQuery>(print(MeDocument))

    expect(res.errors).toBeUndefined()
    expect(res.data?.me).toBeNull()
  })

  it('signup -> signin -> me -> updateCurrentUser', async () => {
    const signupVars: SignupMutationVariables = {
      data: {
        email: 'john@example.com',
        password: 'password123',
        username: 'johndoe',
        fullname: 'John Doe',
      },
    }
    const signupRes = await graphqlRequest<SignupMutation>(
      print(SignupDocument),
      signupVars,
    )

    expect(signupRes.errors).toBeUndefined()
    expect(signupRes.data?.response?.success).toBe(true)
    expect(signupRes.data?.response?.token).toBeTypeOf('string')

    const signinVars: SigninMutationVariables = {
      where: { email: 'john@example.com' },
      data: { password: 'password123' },
    }
    const signinRes = await graphqlRequest<SigninMutation>(
      print(SigninDocument),
      signinVars,
    )

    expect(signinRes.errors).toBeUndefined()
    expect(signinRes.data?.response?.success).toBe(true)
    const token = signinRes.data?.response?.token
    expect(token).toBeTypeOf('string')

    const meRes = await graphqlRequest<MeQuery>(
      print(MeDocument),
      undefined,
      token || undefined,
    )

    expect(meRes.errors).toBeUndefined()
    expect(meRes.data?.me?.username).toBe('johndoe')

    const userId = meRes.data?.me?.id

    const updateVars: UpdateCurrentUserMutationVariables = {
      data: {
        fullname: 'John Updated',
        image: 'https://example.com/avatar.png',
        content: 'Hello world',
      },
    }
    const updateRes = await graphqlRequest<UpdateCurrentUserMutation>(
      print(UpdateCurrentUserDocument),
      updateVars,
      token || undefined,
    )

    expect(updateRes.errors).toBeUndefined()
    expect(updateRes.data?.response?.fullname).toBe('John Updated')
    expect(updateRes.data?.response?.image).toBe(
      'https://example.com/avatar.png',
    )
    expect(updateRes.data?.response?.content).toBe('Hello world')

    const listAfterUpdate = await graphqlRequest<UsersConnectionQuery>(
      print(UsersConnectionDocument),
    )

    expect(listAfterUpdate.errors).toBeUndefined()
    const createdUser = listAfterUpdate.data?.users?.find(
      (u) => u.id === userId,
    )
    expect(createdUser).toBeDefined()
  })

  it('rejects updateCurrentUser when content contains invalid/unclosed tag', async () => {
    const signupVars: SignupMutationVariables = {
      data: {
        email: 'invalid-mdx@example.com',
        password: 'password123',
        username: 'invalidmdx',
        fullname: 'Invalid MDX',
      },
    }
    const signupRes = await graphqlRequest<SignupMutation>(
      print(SignupDocument),
      signupVars,
    )
    expect(signupRes.errors).toBeUndefined()

    const signinVars: SigninMutationVariables = {
      where: { email: 'invalid-mdx@example.com' },
      data: { password: 'password123' },
    }
    const signinRes = await graphqlRequest<SigninMutation>(
      print(SigninDocument),
      signinVars,
    )

    expect(signinRes.errors).toBeUndefined()
    const token = signinRes.data?.response?.token
    expect(token).toBeTypeOf('string')

    const updateVars: UpdateCurrentUserMutationVariables = {
      data: {
        content: 'Broken tag: <script>alert("xss")\n\nNo closing tag.',
      },
    }
    const updateRes = await graphqlRequest<UpdateCurrentUserMutation>(
      print(UpdateCurrentUserDocument),
      updateVars,
      token || undefined,
    )

    expect(updateRes.data?.response).toBeNull()
    expect(updateRes.errors?.length).toBeGreaterThan(0)
  })
})
