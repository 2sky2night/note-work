import Koa from 'koa'
import router from './router'
import koaStatic from 'koa-static'

const app = new Koa()
app.use(koaStatic('./static'))

app.use(async (ctx, next) => {
  // 设置允许跨域的源
  ctx.res.setHeader("Access-Control-Allow-Origin",'*');
  // 设置可以跨域的请求方法
  ctx.res.setHeader("Access-Control-Request-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  await next()

})
app.use(router.routes())
app.listen(3000)

