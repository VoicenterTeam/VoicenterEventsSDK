
class Logger {
  constructor(options = {}) {
    this.debug = options.debug
  }

  /**
   * Logs to console a colored message
   * @param message
   * @param data
   * @private
   */
  _log(message, data) {
    let toLog = data ? `${message}, %c Data -> ${JSON.stringify(data)}` : `${message}`
    let now = new Date().toUTCString()
    console.log(`%c ${now}: %c ${toLog}`, `color: #276749;`, `color: #4299e1;`, `color: #2c3e50;`)
  }

  /**
   * Logs to console a colored message
   * @param message
   * @param data
   * @private
   */
  _error(message, data) {
    let toLog = data ? `${message}, Data -> ${JSON.stringify(data)}` : `${message}`
    let now = new Date().toUTCString()
    console.error(`${now}: ${toLog}`)
  }

  /**
   * Logs messages in case debug mode is set
   * @param message
   * @param data
   */
  log(message, data) {
    if (this.debug) {
      if (message && !data) {
        this._log(message)
      } else {
        this._log(message, data)
      }
    }
  }
  /**
   * Logs error messages in case debug mode is set
   * @param message
   * @param data
   */
  error(message, data) {
    if (this.debug) {
      if (message && !data) {
        this._error(message)
      } else {
        this._error(message, data)
      }
    }
  }
}

export default Logger
