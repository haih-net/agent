import path from 'path'

const CREATE_REEXPORTS = true
const ROOT_DIR = process.cwd()

const GRAPHQL_FOLDER_PATHS: Array<string> = []

const QUERIES_PATH = path.resolve(ROOT_DIR, 'server/externalApiClient/gql/src')

const QUERIES_PATTERN = `${QUERIES_PATH.replace(/\\/g, '/')}/**/*.graphql`

const TS_PATTERN = `${QUERIES_PATH.replace(/\\/g, '/')}/**/*.@(ts|tsx)`

const EXCLUDE_FILES: Array<string> = []

const OUTPUT_PATH = path.resolve(
  ROOT_DIR,
  'server/externalApiClient/gql/generated',
)

const PACKAGE_APP_FILE_PATH = path.resolve(
  ROOT_DIR,
  `server/externalApiClient/gql/generated/index.ts`,
)

const TYPES_FILE_PATH = path.resolve(
  ROOT_DIR,
  `server/externalApiClient/gql/generated/types.ts`,
)

export {
  ROOT_DIR,
  GRAPHQL_FOLDER_PATHS,
  QUERIES_PATH,
  QUERIES_PATTERN,
  EXCLUDE_FILES,
  OUTPUT_PATH,
  PACKAGE_APP_FILE_PATH,
  TYPES_FILE_PATH,
  TS_PATTERN,
  CREATE_REEXPORTS,
}
