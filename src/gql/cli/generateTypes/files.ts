import fs from 'fs'
import path from 'path'
import { OUTPUT_PATH } from './constants'

const readFile = fs.promises.readFile
const writeFile = fs.promises.writeFile
const unlink = fs.promises.unlink

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath)
    return true
  } catch {
    return false
  }
}

/** Функция загружающая файлы по списку путей */
function readFiles(filesList: Array<string>) {
  return Promise.all(filesList.map((fileName) => readFile(fileName, 'utf8')))
}

async function writeFileIfChanged(fileName: string, content: string) {
  const oldContent = (await fileExists(fileName))
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
