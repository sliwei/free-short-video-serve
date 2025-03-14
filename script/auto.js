const fs = require('fs')
const path = require('path')

// 获取文件夹列表
const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

// 获取文件列表
const getFiles = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

const isImageFile = (file) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif']
  return imageExtensions.includes(path.extname(file).toLowerCase())
}

const baseDir = '/Users/awei/Desktop/video'
const directories = getDirectories(baseDir)

const result = directories.map((dir) => {
  const dirPath = path.join(baseDir, dir)
  const files = getFiles(dirPath)

  // 获取海报文件
  const poster = files.find((file) => isImageFile(file))

  // 获取视频文件并排序
  const videos = files
    .filter((file) => file.endsWith('.mp4'))
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[0], 10)
      const numB = parseInt(b.split('.')[0], 10)
      return numA - numB
    })
    .map((file) => ({
      url: `/${dir}/${file}`,
      title: file.split('.')[0]
    }))

  return {
    title: dir,
    number: videos.length,
    poster: `/${dir}/${poster}`,
    videos
  }
})

const outputPath = path.join(__dirname, 'output.json')
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')
console.log('Result has been written to output.json')
