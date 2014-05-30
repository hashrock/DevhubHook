DevhubHook
==========

![image](https://raw.githubusercontent.com/181dev/DevhubHook/master/readme.jpg)


DevHubと各サービスのWebHookをつないで通知を集約するツールです。



対応サービス
----------

 * Gitlab
 * Redmine with [Redmine WebHook](https://github.com/suer/redmine_webhook)

Usage
----


例：
 * Devhub : 192.168.1.5:3000
 * DevhubHook : 192.168.1.5:4000

の場合、下記のようにする。

```
$ git clone https://github.com/181dev/DevhubHook/
$ cd DevhubHook
$ npm install
$ PORT=4000 DEVHUB=http://192.168.1.5:3000 node app.js
```

各WebHookにDevhubHookの待ち受けURLを指定して下さい。
 * redmine: http://192.168.1.5:4000/redmine
 * gitlab: http://192.168.1.5:4000/gitlab


