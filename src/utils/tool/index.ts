import fs from 'fs'
import path from 'path'

/**
 * 随机数函数
 * @param min
 * @param max
 * @returns {number}
 */
export const rand = function (min: number, max: number) {
  return (Math.random() * (max - min + 1) + min) | 0 //特殊的技巧，|0可以强制转换为整数
}

/**
 * 年月日生成
 * @returns {string} 如：201808
 */
export const getDateStr = function () {
  let date = new Date()
  let y = date.getFullYear()
  let m: number | string = date.getMonth() + 1
  let d: number | string = date.getDay()
  m < 10 ? (m = '0' + m) : null
  d < 10 ? (d = '0' + d) : null
  return `${y}${m}${d}`
}

/**
 * 随机字符串生成
 * @param len 生成长度 数字类型
 * @returns {string}
 */
export const randomString = (len: number) => {
  len = len || 32
  let $chars = 'qwertyuioplkjhgfdsazxcvbnm0123456789'
  let maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 获取文件夹列表
export const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

// 遍历文件夹
export function traverseDirectory(dir, parentPath = '') {
  const results = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const relativePath = parentPath ? `${parentPath}/${file}` : file
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      results.push(relativePath)
      results.push(...traverseDirectory(fullPath, relativePath))
    }
  })

  return results
}

// 获取文件列表
export const getFiles = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

// 判断文件是否为图片文件
export const isImageFile = (file) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif']
  return imageExtensions.includes(path.extname(file).toLowerCase())
}

// 随机打乱数组的顺序
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 防抖
export const debounce = (func: { apply: (arg0: undefined, arg1: any[]) => void }, time: number | undefined) => {
  let timer: string | number | NodeJS.Timeout | undefined
  return (...args: any[]) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, time)
  }
}

// 节流
export const throttle = (callback: { apply: (arg0: undefined, arg1: any[]) => void }, wait = 3000) => {
  let timer: any = null
  let startTime: number
  return (...args: any[]) => {
    const ctx = this
    const now = +new Date()
    if (startTime && now < startTime + wait) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        startTime = now
        callback.apply(ctx, args)
      }, wait)
    } else {
      startTime = now
      callback.apply(ctx, args)
    }
  }
}

export const videoExtensions = ['.avi', '.mp4', '.wmv', '.mkv', '.mov', '.rm', '.3gp', '.flv', '.gif', '.mpg', '.rmvb', '.swf', '.vob', '.ts', '.m3u8']

export const getContentType = (path) => {
  const ext = path.split('.').pop().toLowerCase()
  switch (ext) {
    case 'avi':
      return 'video/x-msvideo'
    case 'mp4':
      return 'video/mp4'
    case 'wmv':
      return 'video/x-ms-wmv'
    case 'mkv':
      return 'video/x-matroska'
    case 'mov':
      return 'video/quicktime'
    case 'rm':
      return 'application/vnd.rn-realmedia'
    case '3gp':
      return 'video/3gpp'
    case 'flv':
      return 'video/x-flv'
    case 'gif':
      return 'image/gif'
    case 'mpg':
      return 'video/mpeg'
    case 'rmvb':
      return 'application/vnd.rn-realmedia-vbr'
    case 'swf':
      return 'application/x-shockwave-flash'
    case 'vob':
      return 'video/dvd'
    case 'ts':
      return 'video/MP2T'
    case 'm3u8':
      return 'application/vnd.apple.mpegurl'
    default:
      return 'application/octet-stream'
  }
}
