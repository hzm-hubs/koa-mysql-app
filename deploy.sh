
tar zcf koa-mysql-app.tar.gz --exclude=node_modules --exclude=deploy.sh --exclude=koa-mysql-app.tar.gz .

scp koa-mysql-app.tar.gz root@8.130.22.118:/documents/back

echo '代码包上传成功'

# ssh bonc2@10.131.129.2 -p 22 "sudo mv /data01/dist.tar.gz"

ssh root@8.130.22.118 "cd /documents/back && sudo rm -rf koa-mysql-app/* && sudo tar zxf koa-mysql-app.tar.gz -C koa-mysql-app && pm2 reload koa-mysql-app && exit"

echo '代码包替换成功'

rm -f koa-mysql-app.tar.gz
