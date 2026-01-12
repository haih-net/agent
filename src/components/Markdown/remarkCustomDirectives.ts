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
 * Draft. Not fully developed yet. Allows processing custom tags like :::gallery
 */

// Mapping of special directives to HTML elements and classes
const directiveMapping: Record<string, { tag: string; className: string }> = {
  note: { tag: 'div', className: 'alert alert-info' },
  warning: { tag: 'div', className: 'alert alert-warning' },
  info: { tag: 'div', className: 'alert alert-primary' },
}

// Plugin for processing custom directives
export function remarkCustomDirectives() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tree: any,
  ) => {
    visit(tree, (node: Node) => {
      // Processing container directives (:::gallery, :::note, :::warning, :::info)

      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        // Check if there is special processing for this directive
        const mappedDirective = directiveMapping[node.name || '']

        if (mappedDirective) {
          // If this is a special directive, use the corresponding tag and class
          data.hName = mappedDirective.tag
          data.hProperties = {
            ...attributes,
            class: mappedDirective.className,
          }
        } else {
          // Otherwise use directive name as tag
          data.hName = node.name
          data.hProperties = attributes
        }
      }
    })
  }
}
