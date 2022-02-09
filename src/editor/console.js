let console = (function (oldConsole) {
  return {
    formatArgsOutput: function(arg) {
      let outputArgMessage
      switch (this.getType(arg)) {
        case "string":
          if (((arg[0] + arg[1] + arg[2] + arg[3] + arg[4]) != "Warn:") &
              ((arg[0] + arg[1] + arg[2] + arg[3] + arg[4]) != "Info:")) {
            outputArgMessage = `"${arg}"`
          }
          else {
            outputArgMessage = `${arg}`
          }
          break
        case "object":
          outputArgMessage = `Object ${JSON.stringify(arg)}`
          break
        case "array":
          outputArgMessage = `Array ${JSON.stringify(arg)}`
          break
        default:
          outputArgMessage = arg
          break
      }

      return outputArgMessage
    },
    getType: function (arg) {
      if (typeof arg === "string") return "string"
      if (typeof arg === "boolean") return "boolean"
      if (typeof arg === "function") return "function"
      if (typeof arg === "number") return "number"
      if (typeof arg === "undefined") return "undefined"
      if (typeof arg === "object" && !Array.isArray(arg)) return "object"
      if (typeof arg === "object" && Array.isArray(arg)) return "array"
    },
    logMultipleArguments: function (arguments) {
      arguments.forEach(arg => {
        this.logSingleArgument(arg)
      })
    },
    logSingleArgument: function (logItem) {
      if (this.getType(logItem) === "string") {
        if (((logItem[0] + logItem[1] + logItem[2] + logItem[3] + logItem[4]) != "Warn:") &
            ((logItem[0] + logItem[1] + logItem[2] + logItem[3] + logItem[4]) != "Info:")) {
          consoleMessages.push({
            message: this.formatArgsOutput(logItem),
            class: `log log--${this.getType(logItem)}`
          })
        }
        else {
          consoleMessages.push({
            message: this.formatArgsOutput(logItem),
            class: `log log--default`
          })
        }
      }
      else {
        consoleMessages.push({
          message: this.formatArgsOutput(logItem),
          class: `log log--${this.getType(logItem)}`
        })
      }
    },
    log: function (text) {
      let argsArray = Array.from(arguments)
      return argsArray.length !== 1 ? this.logMultipleArguments(argsArray) : this.logSingleArgument(text)
    },
    info: function (text) {
      this.log('Info: ' + text)
    },
    warn: function (text) {
      this.log('Warn: ' + text)
    },
    error: function (err) {
      oldConsole.error(err)
      consoleMessages.push({
        message: `${err.name}: ${err.message}`,
        class: "log log--error"
      })
    }
  }
})(window.console)
