import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Markdown } from './index'

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  parameters: {
    // layout: 'centered',
  },
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
    children: `# Форматированный текст

**Жирный текст**, *курсив* и ~~зачеркнутый текст~~.

## Списки

### Маркированный список:
- Пункт 1
- Пункт 2
  - Вложенный пункт
- Пункт 3

### Нумерованный список:
1. Первый пункт
2. Второй пункт
3. Третий пункт
`,
  },
}

export const WithLinks: Story = {
  args: {
    children: `# Ссылки

[Обычная ссылка](https://example.com)

[Ссылка с текстом при наведении](https://example.com "Пример подсказки")

## Специальные ссылки:

Телефон: [+7 (999) 123-45-67](tel:+79991234567)

Email: [example@example.com](mailto:example@example.com)

## Внутренние ссылки:

[Ссылка на другую страницу](/about)
`,
  },
}

export const WithCustomDirectives: Story = {
  args: {
    children: `# Пользовательские директивы

:::note
Это примечание с важной информацией
:::

:::warning
Предупреждение! Обратите внимание на это.
:::

:::info
Полезная информация для пользователя.
:::
`,
  },
}

export const WithReactComponents: Story = {
  args: {
    children: `# С React-компонентами
 
`,
  },
}

export const ComplexExample: Story = {
  args: {
    children: `# Комплексный пример

## Текст и форматирование

Это обычный текст с **жирным** и *курсивным* форматированием.

> Это цитата с [ссылкой](https://example.com)

## Таблица (через GFM)

| Имя | Возраст | Город |
| --- | ------- | ----- |
| Анна | 25 | Москва |
| Иван | 30 | Санкт-Петербург |
| Мария | 27 | Казань |

## Код

NPS >40

< tag
<tag

{ test }

{

some text

}

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Изображение

![Пример изображения](https://via.placeholder.com/150)

## Список с задачами

- [x] Задача 1 выполнена
- [ ] Задача 2 в процессе
- [ ] Задача 3 не начата

`,
  },
}
