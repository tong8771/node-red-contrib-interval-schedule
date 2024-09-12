module.exports = function(RED) {
  function IntervalSchedule(config) {
    RED.nodes.createNode(this,config)
    const node = this
    node.name = config.name
    let timers = {}
    
    node.on('input', function(msg, send, done) {
      // NodeRed 兼容性代码
      send = send || function () { node.send.apply(node, arguments) }

      try {
        if (typeof msg.payload === 'object' && msg.payload !== null) {
          if (msg.payload.command === 'add') {
            addIntervalTask(msg.payload)
          } else if (msg.payload.command === 'remove') {
            removeIntervalTask(msg.payload)
          }
        } else {
        done(new Error("Payload is not a valid JSON object"))
        }
      } catch (error) {
        console.debug(error)
      }

    })
      
    function addIntervalTask (payload) {
      // 左——>右:新msg内的payload,传入的payload以及传入的payload中的'payload'
      const newMsg = {payload:payload.payload}
      if (!timers[payload.name]) {
        timers[payload.name] = {
          msg: newMsg,
          interval: setInterval(() => { 
            node.send(timers[payload.name].msg)
          }, payload.intervalTime * 1000),
        }
      } else {
        updateIntervalTask(payload)
      }
    }

    function removeIntervalTask(payload) {
      if (timers[payload.name]) {
        clearInterval(timers[payload.name].interval) // 删除定时器对象中的计时器
        delete timers[payload.name] // 删除计时器对象
      }
    }

    function updateIntervalTask(payload) {
      timers[payload.name].msg.payload = payload.payload // 更新为新定时任务中的payload内容
      clearInterval(timers[payload.name].interval)
      timers[payload.name].interval = setInterval(() => {
        node.send(timers[payload.name].msg)
      }, payload.intervalTime * 1000)
    }
  }

  RED.nodes.registerType("intervalSchedule",IntervalSchedule)

}