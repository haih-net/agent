import { useEffect, useCallback } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Snackbar, SnackbarProvider, useSnackbar } from './index'
import { Button } from '../Button'
import { ComponentVariant } from '../interfaces'

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
        <Snackbar />
      </SnackbarProvider>
    ),
  ],
} satisfies Meta

export default meta

// Helper component for demonstration
const SnackbarDemo = ({
  message,
  variant,
  autoHideDuration,
}: {
  message: string
  variant?: 'success' | 'error' | 'info' | 'warning'
  autoHideDuration?: number
}) => {
  const { addMessage } = useSnackbar() || {}

  useEffect(() => {
    addMessage?.(message, { variant, autoHideDuration })
  }, [addMessage, autoHideDuration, message, variant])

  return null
}

type Story = StoryObj

export const Info: Story = {
  render: () => (
    <SnackbarDemo message="This is an informational message" variant="info" />
  ),
}

export const Success: Story = {
  render: () => (
    <SnackbarDemo
      message="Operation completed successfully"
      variant="success"
    />
  ),
}

export const Warning: Story = {
  render: () => (
    <SnackbarDemo message="Warning! This is a warning" variant="warning" />
  ),
}

export const Error: Story = {
  render: () => (
    <SnackbarDemo
      message="An error occurred while performing the operation"
      variant="error"
    />
  ),
}

export const LongDuration: Story = {
  render: () => (
    <SnackbarDemo
      message="This message will be displayed for 10 seconds"
      variant="info"
      autoHideDuration={10000}
    />
  ),
}

export const Multiple: Story = {
  render: () => (
    <>
      <SnackbarDemo message="First message" variant="info" />
      <SnackbarDemo message="Second message" variant="success" />
      <SnackbarDemo message="Third message" variant="warning" />
    </>
  ),
}

const SnackbarWithButtons = () => {
  const snackbar = useSnackbar()

  const handleAddInfo = useCallback(() => {
    snackbar?.addMessage('Informational message', { variant: 'info' })
  }, [snackbar])

  const handleAddSuccess = useCallback(() => {
    snackbar?.addMessage('Successful action', { variant: 'success' })
  }, [snackbar])

  const handleAddWarning = useCallback(() => {
    snackbar?.addMessage('Warning', { variant: 'warning' })
  }, [snackbar])

  const handleAddError = useCallback(() => {
    snackbar?.addMessage('Error', { variant: 'error' })
  }, [snackbar])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '300px',
      }}
    >
      <Button variant={ComponentVariant.PRIMARY} onClick={handleAddInfo}>
        Add Info
      </Button>
      <Button variant={ComponentVariant.SUCCESS} onClick={handleAddSuccess}>
        Add Success
      </Button>
      <Button variant={ComponentVariant.WARNING} onClick={handleAddWarning}>
        Add Warning
      </Button>
      <Button variant={ComponentVariant.DANGER} onClick={handleAddError}>
        Add Error
      </Button>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <SnackbarWithButtons />,
}
