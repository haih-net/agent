import {
  // InsertImage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  // CodeToggle,
  CreateLink,
  // InsertCodeBlock,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  Separator,
  MDXEditorMethods,
} from '@mdxeditor/editor'
import { memo } from 'react'
import { MarkdownEditorToolbarStyled } from './styles'

type MarkdownEditorToolbarProps = {
  editor: MDXEditorMethods | null
}

const MarkdownEditorToolbarComponent: React.FC<
  MarkdownEditorToolbarProps
> = () => {
  return (
    <MarkdownEditorToolbarStyled>
      {/* Basic actions */}
      <UndoRedo />

      {/* Text formatting */}
      <BoldItalicUnderlineToggles />
      {/* <CodeToggle /> */}

      {/* Structural elements */}
      <BlockTypeSelect />
      <ListsToggle />

      {/* Insert objects */}
      {/* <InsertCodeBlock /> */}
      <InsertThematicBreak />
      <CreateLink />
      {/* <InsertImage /> */}

      <Separator />

      {/* Custom components */}
    </MarkdownEditorToolbarStyled>
  )
}

export const MarkdownEditorToolbar = memo(MarkdownEditorToolbarComponent)
