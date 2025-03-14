import path from 'path'
import { debounce, getDirectories, getFiles, isImageFile, shuffleArray } from '../tool'

export const init = debounce(() => {
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

  // 将结果存储到全局变量
  global.data = result

  let result2 = []

  directories.forEach((dir) => {
    const dirPath = path.join(baseDir, dir)
    const files = getFiles(dirPath)

    // 获取海报文件
    const poster = files.find((file) => isImageFile(file))

    // 获取视频文件
    const videos2 = files
      .filter((file) => file.endsWith('.mp4'))
      .map((file) => ({
        title: dir,
        number: files.filter((f) => f.endsWith('.mp4')).length,
        indexTitle: file.split('.')[0],
        poster: `/${dir}/${poster}`,
        url: `/${dir}/${file}`
      }))

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
