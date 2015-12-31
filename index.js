/**
 * fis.baidu.com
 */
/* jslint
 vars: true, indent: 2, stupid: true, node: true
*/
/* jshint asi: true, node: true */
'use strict'
var assert = require('assert')
var path = require('path')
var child_process = require('child_process')
var crypto = require('crypto')
var str = require('string')
module.exports = function (options) {
  assert(options.to, 'options.to is required!')
  assert(options.source, 'options.source is required!')
  var to = options.to
  var source = options.source
  var server = options.server
  var dir = path.join(process.cwd(), source)
  var tmpFilename = crypto.randomBytes(36).toString('hex') + '.zip'
  var local_zipfile = path.join(source, tmpFilename)
  var opt = {
    to: to,
    source: source,
    server: server,
    dir: dir,
    tmpFilename: tmpFilename,
    local_zipfile: local_zipfile
  }
  var cmd = str('cd {opt.dir}; zip -r {opt.tmpFilename} ./*').template(opt).s
  var scp_cmd = str('scp {opt.local_zipfile} server:{opt.to}').template(opt).s
  var unzip_cmd = str('ssh {opt.server} "cd {opt.to}; unzip -o {opt.tmpFilename}; rm {opt.tmpFilename}; exit"').template(opt).s
  var remove_local_zip = str('rm {opt.tmpFilename}').template(opt).s
  var commands = [
    [cmd, '|||-> 本地打包完成'],
    [scp_cmd, '|||-> 上传完成'],
    [unzip_cmd, '|||-> 远程部署完成'],
    [remove_local_zip, '|||-> 本地清理完成']
  ]
  commands.each(function (e) {
    child_process.execSync(e[0])
    console.log(e[1])
  })
}
