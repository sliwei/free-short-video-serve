import { Context, Next } from 'koa'

/**
 * @swagger
 * /api/video/recommend:
 *   post:
 *     tags:
 *       - video
 *     summary: 推荐视频
 *     description: 获取推荐视频
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 description: 页码
 *               num:
 *                 type: number
 *                 description: 每页数量
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const recommend = async (ctx: Context, next: Next) => {
  const { page, num = 5 } = ctx.request.body
  const data2 = global.data2
  // 计算分页数据
  const startIndex = page * num
  const endIndex = startIndex + num
  const videos = data2.slice(startIndex, endIndex)

  ctx.DATA.data = {
    number: data2.length,
    isLastPage: endIndex >= data2.length,
    videos: videos
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/video/list:
 *   post:
 *     tags:
 *       - video
 *     summary: 视频列表
 *     description: 获取视频列表
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 视频标题
 *               page:
 *                 type: number
 *                 description: 页码
 *               num:
 *                 type: number
 *                 description: 每页数量
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const list = async (ctx: Context, next: Next) => {
  const { title, page, num = 5 } = ctx.request.body

  const item = global.data.find((d: any) => d.title === title)
  // 如果没有找到对应的视频列表，返回空数据
  if (!item) {
    ctx.DATA.data = {
      title: title,
      number: 0,
      poster: '',
      isLastPage: true,
      videos: []
    }
    ctx.body = ctx.DATA
    return
  }

  // 计算分页数据
  const startIndex = page * num
  const endIndex = startIndex + num
  const videos = item.videos.slice(startIndex, endIndex)

  ctx.DATA.data = {
    title: item.title,
    number: item.number,
    poster: item.poster,
    isLastPage: endIndex >= item.videos.length,
    videos: videos
  }
  ctx.body = ctx.DATA
}
