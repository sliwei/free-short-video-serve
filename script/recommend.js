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

// 判断文件是否为图片文件
const isImageFile = (file) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif']
  return imageExtensions.includes(path.extname(file).toLowerCase())
}

// 随机打乱数组的顺序
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const baseDir = '/Users/awei/Desktop/video'
const directories = getDirectories(baseDir)

let result = []

directories.forEach((dir) => {
  const dirPath = path.join(baseDir, dir)
  const files = getFiles(dirPath)

  // 获取海报文件
  const poster = files.find((file) => isImageFile(file))

  // 获取视频文件
  const videos = files
    .filter((file) => file.endsWith('.mp4'))
    .map((file) => ({
      title: dir,
      number: files.filter((f) => f.endsWith('.mp4')).length,
      indexTitle: file.split('.')[0],
      poster: `/${dir}/${poster}`,
      url: `/${dir}/${file}`
    }))

  // 添加视频文件到结果列表
  result = result.concat(videos)
})

// 打乱所有视频文件的顺序
const shuffledResult = shuffleArray(result)

// 为打乱后的结果重新生成 index
shuffledResult.forEach((video, index) => {
  video.index = index + 1
})

// 将结果写入 JSON 文件
const outputPath = path.join(__dirname, 'output-recommend.json')
fs.writeFileSync(outputPath, JSON.stringify(shuffledResult, null, 2), 'utf8')
console.log('Result has been written to output-recommend.json')
