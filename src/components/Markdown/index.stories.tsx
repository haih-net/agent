import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Markdown } from './index'

const meta = {
  title: 'Components/Markdown',
  component: Markdown,

  tags: ['autodocs'],
  args: {
    children: '',
  },
} satisfies Meta<typeof Markdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '# Hello World\n\nThis is a markdown field.',
  },
}

export const EmptyField: Story = {
  args: {
    children: null,
  },
}

export const WithFormattedText: Story = {
  args: {
    children: `# Formatted Text

**Bold text**, *italic* and ~~strikethrough text~~.

## Lists

### Bulleted list:
- Item 1
- Item 2
  - Nested item
- Item 3

### Numbered list:
1. First item
2. Second item
3. Third item
`,
  },
}

export const WithLinks: Story = {
  args: {
    children: `# Links

[Regular link](https://example.com)

[Link with hover text](https://example.com "Example tooltip")

## Special links:

Phone: [+7 (999) 123-45-67](tel:+79991234567)

Email: [example@example.com](mailto:example@example.com)

## Internal links:

[Link to another page](/about)
`,
  },
}

export const WithCustomDirectives: Story = {
  args: {
    children: `# Custom Directives

:::note
This is a note with important information
:::

:::warning
Warning! Pay attention to this.
:::

:::info
Useful information for the user.
:::
`,
  },
}

export const WithReactComponents: Story = {
  args: {
    children: `# With React components
 
`,
  },
}

export const BrokenHtmlLikeTagsCrashes: Story = {
  args: {
    children:
      '# Broken HTML-like tags\n\n' +
      'This is intentionally invalid to reproduce the crash:\n\n' +
      '<script>alert("xss")</script>\n\n' +
      '<unknown-tag>unknown-tag</unknown-tag>\n\n' +
      'No closing tag above.',
  },
}

export const ComplexExample: Story = {
  args: {
    children: `# Complex Example

## Text and formatting

This is regular text with **bold** and *italic* formatting.

> This is a quote with a [link](https://example.com)

## Table (via GFM)

| Name | Age | City |
| --- | ------- | ----- |
| Alex | 25 | Berlin |
| John | 30 | London |
| Sarah | 27 | Paris |

## Code

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`


## Task list

- [x] Task 1 completed
- [ ] Task 2 in progress
- [ ] Task 3 not started

`,
  },
}
