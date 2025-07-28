
tar zcf koa-mysql-app.tar.gz --exclude=node_modules --exclude=deploy.sh --exclude=koa-mysql-app.tar.gz .

scp koa-mysql-app.tar.gz root@8.130.22.118:/documents/back

tar zcf koa-mysql-app.tar.gz -C koa-mysql-app

pm2 reload koa-mysql-app