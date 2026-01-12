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

// Вспомогательный компонент для демонстрации
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
    <SnackbarDemo message="Это информационное сообщение" variant="info" />
  ),
}

export const Success: Story = {
  render: () => (
    <SnackbarDemo message="Операция успешно выполнена" variant="success" />
  ),
}

export const Warning: Story = {
  render: () => (
    <SnackbarDemo message="Внимание! Это предупреждение" variant="warning" />
  ),
}

export const Error: Story = {
  render: () => (
    <SnackbarDemo
      message="Произошла ошибка при выполнении операции"
      variant="error"
    />
  ),
}

export const LongDuration: Story = {
  render: () => (
    <SnackbarDemo
      message="Это сообщение будет отображаться 10 секунд"
      variant="info"
      autoHideDuration={10000}
    />
  ),
}

export const Multiple: Story = {
  render: () => (
    <>
      <SnackbarDemo message="Первое сообщение" variant="info" />
      <SnackbarDemo message="Второе сообщение" variant="success" />
      <SnackbarDemo message="Третье сообщение" variant="warning" />
    </>
  ),
}

const SnackbarWithButtons = () => {
  const snackbar = useSnackbar()

  const handleAddInfo = useCallback(() => {
    snackbar?.addMessage('Информационное сообщение', { variant: 'info' })
  }, [snackbar])

  const handleAddSuccess = useCallback(() => {
    snackbar?.addMessage('Успешное действие', { variant: 'success' })
  }, [snackbar])

  const handleAddWarning = useCallback(() => {
    snackbar?.addMessage('Предупреждение', { variant: 'warning' })
  }, [snackbar])

  const handleAddError = useCallback(() => {
    snackbar?.addMessage('Ошибка', { variant: 'error' })
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
        Добавить Info
      </Button>
      <Button variant={ComponentVariant.SUCCESS} onClick={handleAddSuccess}>
        Добавить Success
      </Button>
      <Button variant={ComponentVariant.WARNING} onClick={handleAddWarning}>
        Добавить Warning
      </Button>
      <Button variant={ComponentVariant.DANGER} onClick={handleAddError}>
        Добавить Error
      </Button>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <SnackbarWithButtons />,
}
