const { spawn } = require('child_process')
const { logger } = require('./logger')

const EOL = require('os').EOL

/**
 * @description 지정한 명령어 실행
 * @param {string} cmd 실행할 커맨드 명령어
 * @param {array} args 명령어 인자 리스트
 * @return {Promise}
 */
const executeCommand = (cmd, args) => {
  let responseData = {
    stdout: '',
    stderr: '',
    code: 0
  }
  const command = spawn(cmd, args, {
    encoding: 'utf8',
    shell: true
  })

  return new Promise(resolve => {
    command.stdout.on('data', buffer => {
      const stdout = buffer.toString().trim()
      responseData.stdout += stdout + EOL
      logger.info(`[Command: ${cmd}] ${stdout}`)
    })

    command.stderr.on('data', buffer => {
      const stderr = buffer.toString().trim()
      responseData.stderr += stderr + EOL
      logger.error(`[Command: ${cmd}] ${stderr}`)
    })
  
    command.stdout.on('end', () => {
      responseData.stdout = responseData.stdout.trim()
      responseData.stderr = responseData.stderr.trim()
      logger.info(`[Command: ${cmd}] Stdout on 'end'`)
      resolve(responseData)
    })
  
    command.on('exit', code => {
      responseData.code = code
    })
  })
}

exports.executeCommand = executeCommand
