import {ScriptTarget, createSourceFile, isInterfaceDeclaration, isTypeAliasDeclaration, factory} from 'typescript';
import {fdir} from 'fdir'
import fs from 'fs';
import path from 'path';
import { AVOID_THOSE_FOLDER } from './utils/excludefromTreeSearch';
import chalk from 'chalk';

let found = 0;
let readFileContentFromNodeSearch;
let filePathFromNodeSearch = ''
let isInterfaceValide = false;
let isTypeAliasValide = false

const crawler = new fdir()
  .withBasePath()
  .withFullPaths()
  .exclude((dirName) => AVOID_THOSE_FOLDER.includes(dirName))
  .glob("./**/*.ts", "./**/*.tsx")
  .filter((path) => !(path.endsWith(".test.js") || path.endsWith(".spec.js")))
  .crawl(".")
  .sync();

console.log(chalk.bgMagenta.bold(`We are looking for your files with types and interfaces 👀, please wait a little\n`))

crawler.forEach((fileDestionation) => {
  const readFileContent = fs.readFileSync(fileDestionation, 'utf-8')
  const filePath = path.dirname(fileDestionation)

  try {
    const sourceFile = createSourceFile(filePath, readFileContent, ScriptTarget.Latest)
    sourceFile.forEachChild(nodeSearch => {
      if (isInterfaceDeclaration(nodeSearch)) {
        console.log(`yes! we found:\n ${filePath} \n The ${chalk.bold('Interface')} name: ${nodeSearch.name.text}\n \n`)
        isInterfaceValide = true;
        readFileContentFromNodeSearch = readFileContent
        filePathFromNodeSearch = filePath
        found++
      } else if (isTypeAliasDeclaration(nodeSearch)) {
        console.log(`yes! we found:\n ${filePath} \n The ${chalk.bold('Type')} name: ${nodeSearch.name.text}\n`);
        isTypeAliasValide = true;
        readFileContentFromNodeSearch = readFileContent
        filePathFromNodeSearch = filePath
        found++
      }
    })
  } catch(error) {
    console.log(error)
  }
})

console.log(`We found ${found} typescript types and interface, let's organize all of them!\n`)

// if (isInterfaceValide && isTypeAliasValide) {
//    const getK = readFileContentFromNodeSearch;
//    console.log(getK)
// } else {
//   console.log(chalk.bgRed.bold('The types found are incompatible, try again'))
// }
