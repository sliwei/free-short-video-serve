import path from 'path'
import { debounce, traverseDirectory, getFiles, isImageFile, shuffleArray, videoExtensions } from '../tool'

// 判断文件是否为 M3U8 的 TS 数据文件
function isM3U8TS(dirPath, file) {
  const m3u8Files = getFiles(dirPath).filter((f) => f.toLowerCase().endsWith('.m3u8'))
  for (const m3u8File of m3u8Files) {
    const m3u8Path = path.join(dirPath, m3u8File)
    try {
      const fs = require('fs')
      const m3u8Content = fs.readFileSync(m3u8Path, 'utf-8').toLowerCase()
      if (m3u8Content.includes(file.toLowerCase())) {
        return true
      }
    } catch (error) {
      console.error(`读取 M3U8 文件 ${m3u8Path} 时出错:`, error)
    }
  }
  return false
}

// 过滤视频文件的函数
function filterVideoFiles(files, dirPath) {
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase()
    if (ext === '.ts' && isM3U8TS(dirPath, file)) {
      return false
    }
    return videoExtensions.includes(ext)
  })
}

export const init = debounce(() => {
  const baseDir = process.env.VIDEO_PATH
  const directories = traverseDirectory(baseDir)

  let result2 = []

  directories.forEach((dir) => {
    const dirPath = path.join(baseDir, dir)
    const files = getFiles(dirPath)

    // 获取海报文件
    const poster = files.find((file) => isImageFile(file))

    // 获取视频文件
    const videoFiles = filterVideoFiles(files, dirPath)
    const videos2 = videoFiles.map((file) => {
      const ext = path.extname(file).toLowerCase()
      return {
        title: dir,
        type: ext.slice(1), // 去掉扩展名前面的点，作为 type 字段的值
        number: videoFiles.length,
        indexTitle: file.split('.')[0],
        poster: `/${dir}/${poster}`,
        url: `/${dir}/${file}`
      }
    })

    console.log('init', dir, videos2.length)
    // 添加视频文件到结果列表
    result2 = result2.concat(videos2)
  })

  // 打乱所有视频文件的顺序
  const shuffledResult = shuffleArray(result2)

  // 为打乱后的结果重新生成 index
  shuffledResult.forEach((video, index) => {
    video.index = index + 1
  })
  global.data2 = shuffledResult

  console.log('初始化完成', global.data.length, global.data2.length)
}, 1000)
