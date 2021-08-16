## Initial setup

```bash
$ systemctl stop firewalld 
$ systemctl disbale firewalld
$ vim /etc/selinux/config

$ SELINUX=disabled # change selinux to disabled
$ setenforce 0 # temporarily change selinux status
$ getenforce # check selinux status
```

## Install software dependencies

```bash
$ rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
$ yum clean all && yum makecache

# Install zabbix-server and zabbix-agent
$ yum install zabbix-server-mysql zabbix-agent -y

# Install zabbix-ready nginx
$ yum install centos-release-scl -y
$ yum install rh-php72-php-mysqlnd zabbix-nginx-conf-scl -y
```

Change zabbix configurations and start Web GUI.

```bash
$ vim /etc/yum.repos.d/zabbix.repo 
```

```toml
[zabbix-frontend]
  name=Zabbix Official Repository frontend - $basearch
  baseurl=http://repo.zabbix.com/zabbix/5.0/rhel/7/$basearch/frontend
  enabled=1 # change to 1
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX-A14FE591
```

## Install MySQL

```bash
$ mkdir mysql-dir
$ cd mysql-dir
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.30-1.el7.x86_64.rpm-bundle.tar
$ tar -zxvf mysql-5.7.32-1.el7.x86_64.rpm-bundle.tar
$ yum install *.rpm -y
```

```bash
$ systemctl start mysqld
```

```bash
$ cat /var/log/mysqld.log | grep root
```

Grep default password.

```bash
2021-07-26T10:50:49.538494Z 1 [Note] A temporary password is generated for root@localhost: **20yyk:Ar67S;**
```

Login to database.

```bash
$ mysql -uroot -p
Enter password: 20yyk:Ar67S;
```

Config database.

```bash
set global validate_password_policy=0;
set global validate_password_length=1;
alter user 'root'@'localhost' identified by 'venus'; # Change root password 

use mysql;
update user set host = '%' where user = 'root';
create user 'zabbix'@'%' identified  by '123456';
grant all privileges on zabbix.* to 'zabbix'@'%';
flush privileges;

# Create tables for Zabbix 
create database zabbix character set utf8 collate utf8_bin;
```

Import zabbix template files.

```bash
$ zcat /usr/share/doc/zabbix-server-mysql-5.0.14/create.sql.gz | mysql -uzabbix -p123456 zabbix
```

## Configure zabbix

Change database password.

```bash
$ vim /etc/zabbix/zabbix_server.conf
DBPassword=123456
```
Configure Nginx.

```bash
$ vim /etc/opt/rh/rh-php72/php-fpm.d/zabbix.conf
```

Append `nginx` at the end of line 6.

```
listen.acl_users = apache,nginx
```

Change location to your choice at line 24.

```
php_value[date.timezone] = Asia/shanghai
```

Configure port.

```bash
$ vim /etc/opt/rh/rh-nginx116/nginx/conf.d/zabbix.conf
server {
        listen          80; # uncomment this line 
        server_name     test.zabbix.com; # uncomment and change to your own ip
```

Change your hosts file too if using hostname.

```bash
$ vim /etc/hosts
192.168.xx.xx test.zabbix.com
```

If you are using windows.

```bash
# for window hosts
C:\Windows\System32\drivers\etc\hosts
192.168.xxx.xxx test.zabbix.com 
```

Start service and configure to run on boot.

```bash
systemctl restart zabbix-server zabbix-agent rh-nginx116-nginx rh-php72-php-fpm
systemctl enable zabbix-server zabbix-agent rh-nginx116-nginx rh-php72-php-fpm
```

Change zabbix agent config fie

```bash
$ cat /etc/zabbix/zabbix_agentd.conf | egrep -v "^$|^#"
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=192.168.88.11  # point to ip of zabbix-server
Hostname=venus-sealer
Include=/etc/zabbix/zabbix_agentd.d/*.conf
```

## Configure monitoring

Visit your zabbix-server with a browser.
![](/01-zabbix-install.jpg)
![](/02-zabbix-install.jpg)

Configure database connection information.
![](/03-zabbix-config.jpg)
![](/04-zabbix-hostname.jpg)
![](/05-zabbix-all.jpg)
![](/06-zabbix-finished.jpg)

Login to zabbix. Default user is `Admin` with `zabbix` as password.
![](/07-zabbix-login.jpg)
![](/08-zabbix-dashboard.jpg)

Add zabbix-agent.
![](/09-zabbix-agent.jpg)
![](/10-zabbix-agent-add.jpg)

Check zabbix RAM usage.
![](/11-zabbix-graphs.jpg)
![](/12-zabbix-memory.jpg)

Check problems in dashboard.
![](/13-Alarm-information.jpg)