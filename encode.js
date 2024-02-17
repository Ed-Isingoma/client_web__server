const fs = require('fs');
const path = require('path')

function encodeFolder(folderPath) {
  const filesData = {}
  const files = fs.readdirSync(folderPath)
  if (files.length > 24) {
    throw new Error('Too many files in the folder. Maximum allowed is 24.')
  }
  let totalSize = 0
  for (const file of files) {
    const stats = fs.statSync(path.join(folderPath, file))
    totalSize += stats.size
  }
  if (totalSize > 20 * 1024 * 1024) throw new Error('Combined file size exceeds max limit (20MB).')
  const wantedFilePath = path.join(folderPath, new Date().toString().substring(4, 25).replace(/\s/g, '')+'.printrust')
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const base64Data = fs.readFileSync(filePath, 'base64')
    const storedName = 'file' + file
    filesData[storedName] = base64Data
  });
  fs.appendFileSync(wantedFilePath, JSON.stringify(filesData))
}