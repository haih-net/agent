import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useCallback, useState } from 'react'
import { Modal } from './index'
import { Button } from '../Button'
import { ComponentVariant } from '../interfaces'

const meta = {
  title: 'UI Kit/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof Modal>

const ModalWithTrigger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={handleClose} title="Example Modal">
        <p>This is the modal content. You can put any content here.</p>
        <p>Press Escape or click outside to close.</p>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalWithTrigger />,
}

const ModalWithForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button onClick={handleOpen}>Open Form Modal</Button>
      <Modal isOpen={isOpen} onClose={handleClose} title="Contact Form">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Name" style={{ padding: '8px' }} />
          <input type="email" placeholder="Email" style={{ padding: '8px' }} />
          <textarea placeholder="Message" rows={4} style={{ padding: '8px' }} />
          <Button type="submit" variant={ComponentVariant.PRIMARY}>
            Send
          </Button>
        </form>
      </Modal>
    </>
  )
}

export const WithForm: Story = {
  render: () => <ModalWithForm />,
}
