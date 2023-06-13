

#### 一、服务器基础配置：

```bash
systemctl stop firewalld 
systemctl disbale firewalld
vim /etc/selinux/config

SELINUX=disabled //修改selinux为disabled
setenforce 0 //临时修改selinux状态
getenforce //查看selinux状态
```

#### 二、安装相关软件包

```bash
# rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
# yum clean all && yum makecache

// server端安装zabbix-server和zabbix-agent
# yum install zabbix-server-mysql zabbix-agent -y

//安装zabbix默认的nginx
# yum install centos-release-scl -y
# yum install rh-php72-php-mysqlnd zabbix-nginx-conf-scl -y
```

修改 zabbix 的安装源配置文件，启用前端的源

```bash
# vim /etc/yum.repos.d/zabbix.repo 
[zabbix-frontend]
name=Zabbix Official Repository frontend - $basearch
baseurl=http://repo.zabbix.com/zabbix/5.0/rhel/7/$basearch/frontend
enabled=1 //此处改为1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX-A14FE591
```



#### 三、安装 MySQL

```bash
mkdir mysql-dir
cd mysql-dir
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.30-1.el7.x86_64.rpm-bundle.tar
tar -zxvf mysql-5.7.32-1.el7.x86_64.rpm-bundle.tar
yum install *.rpm -y
```

```bash
systemctl start mysqld
```

```bash
cat /var/log/mysqld.log | grep root
```

2021-07-26T10:50:49.538494Z 1 [Note] A temporary password is generated for root@localhost: **20yyk:Ar67S;**

登录数据库：

```mysql
# mysql -uroot -p
Enter password: 20yyk:Ar67S;
```

配置数据库：

```bash
set global validate_password_policy=0;
set global validate_password_length=1;
alter user 'root'@'localhost' identified by 'venus'; #修改root登录密码为venus

use mysql;
update user set host = '%' where user = 'root';
create user 'zabbix'@'%' identified  by '123456';
grant all privileges on zabbix.* to 'zabbix'@'%';
flush privileges;

# 创建zabbix所需的数据库
create database zabbix character set utf8 collate utf8_bin;
```

导入 zabbix 模版文件：

```bash
zcat /usr/share/doc/zabbix-server-mysql-5.0.14/create.sql.gz | mysql -uzabbix -p123456 zabbix
```



#### 四、修改 zabbix 默认配置文件

1、修改连接数据库的密码：

```bash
# vim /etc/zabbix/zabbix_server.conf
DBPassword=123456
```
2、修改 nginx 和所属地域

```bash
# vim /etc/opt/rh/rh-php72/php-fpm.d/zabbix.conf
# 在第6行后边加上一个nginx
listen.acl_users = apache,nginx

# 在第24行修改zabbix所属的地域
php_value[date.timezone] = Asia/shanghai
```

3、配置监听端口和访问方式

```bash
vim /etc/opt/rh/rh-nginx116/nginx/conf.d/zabbix.conf
server {
        listen          80;//取消注释
        server_name     test.zabbix.com;//取消注释修改成IP或自己的域名
```

4、如果是伪装域名则修改本地的 hosts 文件

```bash
vim /etc/hosts
192.168.xx.xx test.zabbix.com

window hosts文件也需要添加一下
C:\Windows\System32\drivers\etc\hosts
192.168.xxx.xxx test.zabbix.com 
```

5、启动服务并设为开机自启

```bash
# 启动服务
systemctl restart zabbix-server zabbix-agent rh-nginx116-nginx rh-php72-php-fpm
systemctl enable zabbix-server zabbix-agent rh-nginx116-nginx rh-php72-php-fpm
```

6、修改 zabbix-agent 的配置文件

```bash
cat /etc/zabbix/zabbix_agentd.conf | egrep -v "^$|^#"
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=192.168.88.11  //指定zabbix-server的ip地址
Hostname=venus-sealer
Include=/etc/zabbix/zabbix_agentd.d/*.conf
```

#### 四、配置 zabbix 监控主机
1、在浏览器输入 zabbix-server 的 ip 地址或者主机名
![](/01-zabbix-install.jpg)
![](/02-zabbix-install.jpg)

2、配置数据库连接地址信息
![](/03-zabbix-config.jpg)
![](/04-zabbix-hostname.jpg)
![](/05-zabbix-all.jpg)
![](/06-zabbix-finished.jpg)

3、登录到 zabbix 系统，默认的用户为 Admin，密码为 zabbix;注意 Admin 的 A 是大写字母
![](/07-zabbix-login.jpg)
![](/08-zabbix-dashboard.jpg)

4、添加 zabbix-agent 主机
![](/09-zabbix-agent.jpg)
![](/10-zabbix-agent-add.jpg)

5、查看 zabbix 监控机器的内存图
![](/11-zabbix-graphs.jpg)
![](/12-zabbix-memory.jpg)

6、异常报警，需要处理的机器
![](/13-Alarm-information.jpg)