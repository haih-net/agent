// import fs from 'fs';
import path from 'path'
import { glob } from 'glob'

/**
 * Функция для получения уникальных элементов массива
 * @param array Исходный массив
 * @returns Массив с уникальными элементами
 */
function uniq<T>(array: T[]): T[] {
  return [...new Set(array)]
}

import * as codegen from '@graphql-codegen/cli'
import { Types } from '@graphql-codegen/plugin-helpers'
import { TypeScriptPluginConfig } from '@graphql-codegen/typescript'
import { parse, ExecutableDefinitionNode } from 'graphql'

import {
  QUERIES_PATTERN,
  OUTPUT_PATH,
  PACKAGE_APP_FILE_PATH,
  TYPES_FILE_PATH,
  CREATE_REEXPORTS,
  APOLLO_HELPER_FILE_PATH,
} from './constants'

import { readFiles, clearOutputDirectory, writeFileIfChanged } from './files'

const scalars = {
  DateTime: 'globalThis.Date',
  Json: 'globalThis.Record<string, any> | globalThis.Array<any>',
  Long: 'number',
  Upload: 'globalThis.File',
  BigInt: 'string',
  Bytes: 'string',
  integerGteZero:
    "import('src/datagates/validators/IntegerGTEZero').IntegerGTEZero",
  notEmptyString:
    "import('src/datagates/validators/notEmptyStringValidator').NotEmptyString",
}

/** Функция для получения файлов с использованием glob */
async function globAsync(pattern: string): Promise<string[]> {
  try {
    return glob.sync(pattern)
  } catch (error) {
    console.error('Error while searching files:', error)
    return []
  }
}

const prependText = [
  '/* eslint-disable */',
  '\n',
  '// @ts-nocheck\n',
  '\n',
  '/** \n',
  '* THIS FILE IS AUTO-GENERATED, DO NOT EDIT \n',
  '* Command to generate this file: "npm run generate:types" \n',
  '*/',
  '\n',
  '// @ts-nocheck',
  '\n',
  '\n',
]

/** Функция получения списка путей файлов запросов с фронта */
async function getQueryFiles(): Promise<string[]> {
  const files = uniq(await globAsync(QUERIES_PATTERN))
  files.sort()
  return files
}

const namingConvention = {
  enumValues: 'upper-case#upperCase',
  typeNames: 'pascal-case#pascalCase',
}

export const typescriptPluginConfig: TypeScriptPluginConfig = {
  onlyOperationTypes: false,
  namingConvention,
  scalars,
  declarationKind: {
    type: 'interface',
    input: 'interface',
  },
}

function createQueriesMap(filesMap: Map<string, string>) {
  let documentsString = ''
  for (const contents of filesMap.values()) {
    documentsString += contents + '\n'
  }

  const definitions = parse(documentsString).definitions

  const queriesAndFragments = definitions.filter(
    ({ kind }) =>
      kind === 'OperationDefinition' || kind === 'FragmentDefinition',
  ) as Array<ExecutableDefinitionNode>

  const queriesMap = new Map()
  queriesAndFragments.forEach((definition) => {
    if (definition.name && definition.loc) {
      const name = definition.name.value
      const oldText = queriesMap.get(name)
      if (!oldText) {
        queriesMap.set(
          name,
          documentsString.substring(definition.loc.start, definition.loc.end),
        )
      } else {
        const newText = documentsString.substring(
          definition.loc.start,
          definition.loc.end,
        )
        if (
          oldText.replace(/\r/g, '').trim() !==
          newText.replace(/\r/g, '').trim()
        ) {
          throw new Error(`duplicate definitions ${name}`)
        }
      }
    }
  })
  return queriesMap
}

const typescriptConfig = {
  plugins: [
    {
      add: {
        content: prependText.join(''),
      },
    },
    'typescript',
  ],
  config: typescriptPluginConfig,
}

/**
 * Генерируем типы из schema.json
 */
async function generateTypesFromSchema() {
  const schema = path.join(OUTPUT_PATH, 'schema.json')

  const input: Types.Config = {
    schema,
    generates: {
      [TYPES_FILE_PATH]: typescriptConfig,
      [APOLLO_HELPER_FILE_PATH]: {
        plugins: ['typescript-apollo-client-helpers'],
      },
    },
  }

  await codegen.generate(input, true)

  // await codegen.generate(
  //   {
  //     schema,
  //     generates: {
  //       [TYPES_FILE_PATH]: typescriptConfig,
  //       [APOLLO_HELPER_FILE_PATH]: {
  //         plugins: ['typescript-apollo-client-helpers'],
  //       },
  //     },
  //   },
  //   true
  // )
}

/** Функция создающая Map с graphql файлами
 * */
async function createInitialMap(): Promise<Map<string, string>> {
  const queryFileNames = await getQueryFiles()
  const queryFileContents = await readFiles(queryFileNames)
  return new Map<string, string>(
    queryFileNames.map((name, index) => [name, queryFileContents[index] ?? '']),
  )
}

/**
 * Функция генерирующая index.ts из Map с graphql файлами
 */
async function generateTypesFromMap() {
  const filesMap = await createInitialMap()

  /**
   * Ничего не делаем, если не были получены файлы
   */
  if (!filesMap.size) {
    return
  }

  const queriesMap = createQueriesMap(filesMap)

  function loaderFunction(name: string) {
    const query = parse(queriesMap.get(path.basename(name)))

    // console.log("loaderFunction query", query);
    return query
  }

  const loader = { loader: loaderFunction }

  // const documents: Types.Config["documents"] = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const documents: any = {}

  for (const name of queriesMap.keys()) {
    documents[path.join(OUTPUT_PATH, name)] = loader
  }

  // console.log("documents", documents);

  const codegenConfig: Types.ConfiguredOutput = {
    plugins: [
      {
        add: {
          content: prependText.join(''),
        },
      },
      'typescript-operations',
      'typescript-react-apollo',
      // "typescript-apollo-client-helpers",
    ],
    preset: 'near-operation-file',
    presetConfig: {
      extension: '.ts',
      baseTypesPath: './types.ts',
    },
    config: {
      withHOC: false,
      withHooks: true,
      withComponent: false,
      preResolveTypes: true,
      exportFragmentSpreadSubTypes: true,
      apolloReactHooksImportFrom: '@apollo/client/react',
    },
  }

  const input: Types.Config & { cwd?: string } = {
    schema: path.join(OUTPUT_PATH, 'schema.json'),
    documents,
    config: typescriptPluginConfig,
    generates: {
      types: codegenConfig,
    },
  }

  const generatedFiles = await codegen.generate(input, false)
  await Promise.all(
    generatedFiles.map(
      ({ filename, content }: { filename: string; content: string }) => {
        const updated = content.replace(
          /import \* as Types from '.*?';/g,
          `import * as Types from './types';`,
        )
        return writeFileIfChanged(filename, updated)
      },
    ),
  )

  if (CREATE_REEXPORTS) {
    await writeFileIfChanged(
      PACKAGE_APP_FILE_PATH,
      generatedFiles
        .map(
          ({ filename }: { filename: string }) =>
            `export * from './${path.basename(filename, '.ts')}';`,
        )
        .join('\n') + "export * from './types';\n",
    )
  }
}

/** Функция создающая index.ts */
async function generateTypes() {
  // Очищаем директорию от сгенерированных ранее ts-файлов
  await clearOutputDirectory()

  // Генерируем типы от АПИ-схемы
  await generateTypesFromSchema()

  // Генерируем типы для фронтовых запросов
  await generateTypesFromMap()
}

export { generateTypes }
