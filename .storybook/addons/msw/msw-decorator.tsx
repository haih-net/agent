import React, { useEffect, useState } from 'react'
import type { Decorator } from '@storybook/react'
import { initializeMsw, isMswInitialized, isMswInitializing } from './msw'
import { MswParameters, setupMswMocks } from './msw-adapter'

interface MswWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Story: React.ComponentType<any>
}

const MswWrapper: React.FC<MswWrapperProps> = ({ Story, context }) => {
  const [isInitialized, setIsInitialized] = useState(isMswInitialized())
  const [isLoading, setIsLoading] = useState(
    !isInitialized && !isMswInitializing(),
  )

  useEffect(() => {
    if (!isInitialized && !isMswInitializing()) {
      setIsLoading(true)

      initializeMsw()
        .then(() => {
          setIsInitialized(true)
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isInitialized])

  useEffect(() => {
    if (isInitialized) {
      const parameters = context.parameters as MswParameters

      setupMswMocks(parameters)
    }
  }, [isInitialized, context.parameters])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <div>MSW initializing...</div>
      </div>
    )
  }

  return <Story {...context} />
}

export const withMsw: Decorator = (Story, context) => {
  return <MswWrapper Story={Story} context={context} />
}
