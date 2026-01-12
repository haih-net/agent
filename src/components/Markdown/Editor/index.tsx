import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  imagePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  MDXEditorMethods,
  // diffSourcePlugin,
  directivesPlugin,
  quotePlugin,
  linkPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  jsxPlugin,
  JsxComponentDescriptor,
  MDXEditorProps,
  RealmPlugin,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

import { memo, useCallback, useMemo, useState } from 'react'
import { MarkdownEditorStyled } from './styles'
import { MarkdownEditorToolbar } from './Toolbar'

type MarkdownEditorEditorProps = {
  value: string | null | undefined
  onChange: (value: string) => void
}

const MarkdownEditorComponent: React.FC<MarkdownEditorEditorProps> = ({
  value,
  onChange,
  ...other
}) => {
  const [editor, editorSetter] = useState<MDXEditorMethods | null>(null)

  const jsxComponentDescriptors = useMemo<JsxComponentDescriptor[]>(() => {
    return []
  }, [])

  const plugins = useMemo(() => {
    const plugins: RealmPlugin[] = [
      directivesPlugin({
        directiveDescriptors: [],
        escapeUnknownTextDirectives: true,
      }),
      headingsPlugin(),
      listsPlugin(),
      thematicBreakPlugin(),
      imagePlugin({
        imageUploadHandler: (_file) => {
          // file upload to server, return URL
          return Promise.resolve('https://picsum.photos/200/300')
        },
        imageAutocompleteSuggestions: [],
      }),
      jsxPlugin({ jsxComponentDescriptors }),

      quotePlugin(),
      linkPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
      codeMirrorPlugin(),

      toolbarPlugin({
        toolbarContents: () => {
          return <MarkdownEditorToolbar editor={editor} />
        },
      }),
    ]

    return plugins
  }, [editor, jsxComponentDescriptors])

  return (
    <MarkdownEditorStyled {...other}>
      <MDXEditor
        ref={editorSetter}
        contentEditableClassName="content"
        markdown={value ?? ''}
        onChange={onChange}
        onError={useCallback<NonNullable<MDXEditorProps['onError']>>((err) => {
          console.error('Parse error:', err)
          console.error('Parse error:', err.error)
        }, [])}
        plugins={plugins}
      />
    </MarkdownEditorStyled>
  )
}

export const MarkdownEditor = memo(MarkdownEditorComponent)

// For avoid storybook error
export default MarkdownEditor
