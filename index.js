/**
 * fis.baidu.com
 */
'use strict';
var _ = fis.util,
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    child_process = require('child_process'),
    crypto = require('crypto'),
    str = require('string');
module.exports = function (options, modified, total, callback) {
    assert(options.to, 'options.to is required!');
    assert(options.source, 'options.source is required!');
    var opt = {
            to: options.to,
            source: options.source,
            server: options.server,
            dir: path.join(process.cwd(), this.source),
            tmpFilename: crypto.randomBytes(4).toString('hex') + '.zip', // 避免本来目录已经有个文件叫做 dist.zip
            local_zipfile: path.join(this.source, this.tmpFilename),
        },
        cmd = str('cd {dir}; zip -r {tmpFilename} ./*').template(opt).s,
        scp_cmd = str('scp {opt.local_zipfile} server:{opt.to}').template(opt).s,
        unzip_cmd = str('ssh {opt.server} "cd {opt.to}; unzip -o {opt.tmpFilename}; rm {opt.tmpFilename}; exit"').template(opt).s,
        remove_local_zip = str('rm {opt.tmpFilename}'),
        commands = [
            [cmd, '|||-> 本地打包完成'],
            [scp_cmd, '|||-> 上传完成'],
            [unzip_cmd, '|||-> 远程部署完成'],
            [remove_local_zip, '|||-> 本地清理完成']
        ];
    // 为了代码好看点，用sync函数也不算什么啦：）
    commands.each(function (e) {
        child_process.execSync(e[0], function (e, ignore) {
            if (e) {
                throw e;
            }
            console.log(e[1]);
        });
    });
};
