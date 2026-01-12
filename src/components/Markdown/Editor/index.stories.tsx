import { useState, useCallback } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MarkdownEditor as Component } from './index'

const meta = {
  title: 'Components/MarkdownEditor',
  component: Component,

  tags: ['autodocs'],
  args: {
    value: '',
    // eslint-disable-next-line no-console
    onChange: console.log,
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '# Hello World\n\nThis is a markdown editor.',
    // eslint-disable-next-line no-console
    onChange: console.log,
  },
}

export const EmptyEditor: Story = {
  args: {
    value: '',
    // eslint-disable-next-line no-console
    onChange: console.log,
  },
}

// Interactive example with real text changes
export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(
      '# Interactive Markdown Editor\n\nEdit this text to see changes in real-time.',
    )

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChange = useCallback((newValue: string) => {
      setValue(newValue)
    }, [])

    return (
      <div style={{ width: '800px', height: '500px' }}>
        <Component value={value} onChange={handleChange} />
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <h4>Original Markdown:</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{value}</pre>
        </div>
      </div>
    )
  },
}

export const WithReactComponents: Story = {
  args: {
    value: `# Markdown With React components

<MdTestComponent a="1" b="2" />

`,
    // eslint-disable-next-line no-console
    onChange: console.log,
  },
}

export const WithComplexContent: Story = {
  args: {
    value: `# Markdown Editor Demo

## Formatting Options

 **Bold Text** and *Italic Text* are supported.

 ### Lists
 - Item 1
 - Item 2
   - Nested Item
 - Item 3
 
### Simple Code

### Links
[Example Link](https://example.com)

### Blockquote
> This is a blockquote.

---

`,
    // eslint-disable-next-line no-console
    onChange: console.log,
  },
}

export const MultyEditors: Story = {
  args: {
    value: `# Markdown Editor Demo

## Formatting Options

 **Bold Text** and *Italic Text* are supported.

 ### Lists
 - Item 1
 - Item 2
   - Nested Item
 - Item 3
 
### Simple Code

### Links
[Example Link](https://example.com)

### Blockquote
> This is a blockquote.

---

`,
    // eslint-disable-next-line no-console
    onChange: console.log,
  },

  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(
      '# Interactive Markdown Editor\n\nEdit this text to see changes in real-time.',
    )

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChange = useCallback((newValue: string) => {
      setValue(newValue)
    }, [])

    return (
      <div style={{ width: '800px', height: '500px' }}>
        <h3>First editor</h3>
        <Component value={value} onChange={handleChange} />

        <h3>Second editor</h3>
        <Component value={`Some content`} onChange={handleChange} />
      </div>
    )
  },
}
