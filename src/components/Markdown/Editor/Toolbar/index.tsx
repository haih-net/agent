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
      {/* Базовые действия */}
      <UndoRedo />

      {/* Форматирование текста */}
      <BoldItalicUnderlineToggles />
      {/* <CodeToggle /> */}

      {/* Структурные элементы */}
      <BlockTypeSelect />
      <ListsToggle />

      {/* Вставка объектов */}
      {/* <InsertCodeBlock /> */}
      <InsertThematicBreak />
      <CreateLink />
      {/* <InsertImage /> */}

      <Separator />

      {/* Кастомные компоненты */}
    </MarkdownEditorToolbarStyled>
  )
}

export const MarkdownEditorToolbar = memo(MarkdownEditorToolbarComponent)
