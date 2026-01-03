import fs from 'fs'
import path from 'path'
import util from 'util'
import { OUTPUT_PATH } from './constants'

const exists = (filePath: string) =>
  fs.promises
    .access(filePath)
    .then(() => true)
    .catch(() => false)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

/** Функция загружающая файлы по списку путей */
function readFiles(filesList: Array<string>) {
  return Promise.all(filesList.map((fileName) => readFile(fileName, 'utf8')))
}

async function writeFileIfChanged(fileName: string, content: string) {
  const oldContent = (await exists(fileName))
    ? await readFile(fileName, 'utf8')
    : ''
  if (oldContent !== content) {
    await writeFile(fileName, content)
  }
}

function clearOutputDirectory() {
  const filenames = fs
    .readdirSync(OUTPUT_PATH)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => path.join(OUTPUT_PATH, name))
  return Promise.all(filenames.map((filename) => unlink(filename)))
}

export { readFiles, clearOutputDirectory, writeFileIfChanged }
