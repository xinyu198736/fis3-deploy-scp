###*
# fis.baidu.com
###
assert = require('assert')
path = require('path')
exec = require('child_process').execSync
crypto = require('crypto')

module.exports = (options) ->
    assert options.to, 'options.to is required!'
    assert options.source, 'options.source is required!'
    to = options.to
    source = options.source
    server = options.server
    dir = path.join(process.cwd(), source)
    tmpFilename = "#{crypto.randomBytes(36).toString('hex')}.zip"
    local_zipfile = path.join(source, tmpFilename)
    cmd = "cd #{dir}; zip -r #{tmpFilename} ./*"
    scp_cmd = "scp #{local_zipfile} server:#{to}"
    unzip_cmd = "ssh #{server} 'cd #{to}; unzip -o #{tmpFilename}; \
        rm #{tmpFilename}; exit'"
    remove_local_zip = "rm #{tmpFilename}"
    commands = [
      [
        cmd
        '|||-> 本地打包完成'
      ]
      [
        scp_cmd
        '|||-> 上传完成'
      ]
      [
        unzip_cmd
        '|||-> 远程部署完成'
      ]
      [   a
        remove_local_zip
        '|||-> 本地清理完成'
      ]
    ]
  commands.each (e) ->
      exec e[0]
      console.log e[1]
