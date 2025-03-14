# free-short-video-serve
免费短剧服务端

> 基于koa/ts/sequelize/mariadb/redis/swagger,node@18

## 开发/运行

src/config/index.ts是变量信息,开发使用默认变量,生产环境运行时,先赋值需要修改的变量

创建.env.local文件，配置环境变量

```
# .env.local
# 环境
NODE_ENV=development

# 邮箱
MAIL_FROM=xxx@xxx.com
MAIL_USER=xxx@xxx.com
MAIL_PASS=xxx

# 数据库
DB_database=xxx
DB_username=xxx
DB_password=xxx
DB_host=xxx
DB_port=3306

# redis
RD_url=redis://default:xxx@xxx.cn:6379/0
```

```
# 安装依赖
yarn
# 开发
yarn dev
# 编译
yarn build

# 运行
export env1=xxx
export env2=xxx
node dist/index.js
```


## 部署

github actions
