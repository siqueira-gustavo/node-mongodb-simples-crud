import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import fs from 'node:fs'
import path from 'node:path'
import log, { LogLevel } from './logging-service'

// Mocks para fs e path
jest.mock('node:fs')
jest.mock('node:path')

// Define a variável que simula o sistema de arquivos
const appendFileMock = jest.spyOn(fs, 'appendFile')
const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync')

// Define a variável que simula o sistema de arquivos
const existsSyncMock = jest.spyOn(fs, 'existsSync')

// Função auxiliar para validar chamadas de log
const validateLogCall = ({
  level,
  code,
  messages,
  filePath,
}: {
  level: LogLevel
  code: string
  messages: string[]
  filePath: string
}) => {
  const isoTimestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

  // Define a expressão regular para validar o log
  const logMessageRegex = new RegExp(
    `\\[${
      isoTimestampRegex.source
    }] \\[${level.toUpperCase()}] \\[${code}] ${messages.join(' ')}\\n`
  )

  expect(appendFileMock).toHaveBeenCalledWith(
    filePath,
    expect.stringMatching(logMessageRegex),
    expect.any(Function)
  )
}

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar o diretório de logs se não existir', () => {
    existsSyncMock.mockReturnValue(false) // Simulando que o diretório não existe

    const code = new Error('TestError')
    const messages = ['Test message']

    log.error(code, ...messages)

    expect(mkdirSyncMock).toHaveBeenCalledTimes(1)
    expect(mkdirSyncMock).toHaveBeenCalledWith(
      path.resolve(process.cwd(), 'logs'),
      { recursive: true }
    )
  })

  it('deve escrever no arquivo de log ao chamar o método error', () => {
    const code = new Error('TestError')
    const messages = ['Test message']
    const logFilePath = path.join(process.cwd(), 'logs', 'error.log')

    log.error(code, ...messages)
    validateLogCall({
      code: code.message,
      messages,
      level: LogLevel.ERROR,
      filePath: logFilePath,
    })
  })

  it('deve escrever no arquivo de log ao chamar o método warn', () => {
    const code = 'TestWarn'
    const messages = ['Warning message']
    const logFilePath = path.join(process.cwd(), 'logs', 'warn.log')

    log.warn(code, ...messages)
    validateLogCall({
      code,
      messages,
      level: LogLevel.WARN,
      filePath: logFilePath,
    })
  })

  it('deve escrever no arquivo de log ao chamar o método debug', () => {
    const code = 'TestDebug'
    const messages = ['Debug message']
    const logFilePath = path.join(process.cwd(), 'logs', 'debug.log')

    log.debug(code, ...messages)
    validateLogCall({
      code,
      messages,
      level: LogLevel.DEBUG,
      filePath: logFilePath,
    })
  })

  it('deve chamar os métodos console apropriados para cada nível de log', () => {
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {})
    const consoleDebugMock = jest
      .spyOn(console, 'debug')
      .mockImplementation(() => {})

    const errorCode = new Error('Error Code')
    const warnCode = 'Warn Code'
    const debugCode = 'Debug Code'

    log.error(errorCode, 'Error occurred')
    log.warn(warnCode, 'Warning occurred')
    log.debug(debugCode, 'Debugging')

    expect(consoleErrorMock).toHaveBeenCalledWith(
      '[ERROR] [Error: Error Code]',
      'Error occurred'
    )
    expect(consoleWarnMock).toHaveBeenCalledWith(
      '[WARN] [Warn Code]',
      'Warning occurred'
    )
    expect(consoleDebugMock).toHaveBeenCalledWith(
      '[DEBUG] [Debug Code]',
      'Debugging'
    )

    consoleErrorMock.mockRestore()
    consoleWarnMock.mockRestore()
    consoleDebugMock.mockRestore()
  })

  it('deve registrar um erro se falhar ao escrever no arquivo de log', () => {
    const error = new Error('Falha ao escrever no arquivo de log')
    appendFileMock.mockImplementationOnce((_, __, callback) => {
      if (callback instanceof Function) {
        callback(error)
      }
    })

    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const code = new Error('TestError')
    const messages = ['Test message']
    log.error(code, ...messages)

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Falha ao escrever no arquivo de log:',
      error
    )

    consoleErrorMock.mockRestore()
  })
})
