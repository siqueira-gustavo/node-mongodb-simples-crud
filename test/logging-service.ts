import fs from 'node:fs'
import path from 'node:path'

/**
 * Enum para os níveis de log disponíveis.
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
}

/**
 * Interface que define a estrutura do Logger.
 */
export interface Logger {
  error(code: Error, ...messages: string[]): void
  warn(code: string, ...messages: string[]): void
  debug(code: string, ...messages: string[]): void
}

/**
 * Define o diretório onde os logs serão armazenados.
 */
const logDirectory: string = path.resolve(process.cwd(), 'logs')

/**
 * Função auxiliar para escrever logs em arquivos.
 * @param level - Nível do log (error, warn, debug).
 * @param code - Código identificador do log.
 * @param messages - Mensagens a serem registradas.
 */
const writeLogToFile = (
  level: LogLevel,
  code: string,
  messages: string[]
): void => {
  /**
   * Cria o diretório de logs se não existir.
   */
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true })
  }

  const timestamp: string = new Date().toISOString()
  const logMessage: string = `[${timestamp}] [${level.toUpperCase()}] [${code}] ${messages.join(
    ' '
  )}\n`
  const logFilePath = path.join(logDirectory, `${level}.log`)

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Falha ao escrever no arquivo de log:', err)
    }
  })
}

/**
 * Implementação do Logger com métodos error, warn e debug.
 */
const log: Logger = {
  error(code: Error, ...messages: string[]): void {
    const formattedMessage: string = messages.join(' ')
    console.error(`[ERROR] [${code}]`, formattedMessage)
    writeLogToFile(LogLevel.ERROR, code.message, messages)
  },

  warn(code: string, ...messages: string[]): void {
    const formattedMessage: string = messages.join(' ')
    console.warn(`[WARN] [${code}]`, formattedMessage)
    writeLogToFile(LogLevel.WARN, code, messages)
  },

  debug(code: string, ...messages: string[]): void {
    const formattedMessage: string = messages.join(' ')
    console.debug(`[DEBUG] [${code}]`, formattedMessage)
    writeLogToFile(LogLevel.DEBUG, code, messages)
  },
}

export default log
