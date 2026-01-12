import { visit } from 'unist-util-visit'

interface Node {
  type: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
}

/**
 * Draft. Не доработано совсем. Позволяет обработать кастомные теги типа :::gallery
 */

// Маппинг специальных директив на HTML элементы и классы
const directiveMapping: Record<string, { tag: string; className: string }> = {
  note: { tag: 'div', className: 'alert alert-info' },
  warning: { tag: 'div', className: 'alert alert-warning' },
  info: { tag: 'div', className: 'alert alert-primary' },
}

// Плагин для обработки кастомных директив
export function remarkCustomDirectives() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tree: any,
  ) => {
    visit(tree, (node: Node) => {
      // Обработка контейнерных директив (:::gallery, :::note, :::warning, :::info)

      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        // Проверяем, есть ли специальная обработка для этой директивы
        const mappedDirective = directiveMapping[node.name || '']

        if (mappedDirective) {
          // Если это специальная директива, используем соответствующий тег и класс
          data.hName = mappedDirective.tag
          data.hProperties = {
            ...attributes,
            class: mappedDirective.className,
          }
        } else {
          // Иначе используем имя директивы как тег
          data.hName = node.name
          data.hProperties = attributes
        }
      }
    })
  }
}
