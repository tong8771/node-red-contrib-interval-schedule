module.exports = function(RED) {
  function IntervalSchedule(config) {
    RED.nodes.createNode(this,config);
    const node = this;
    node.name = config.name;
    let timers = {};
    
    node.on('input', function(msg, send, done) {
      // NodeRed 兼容性代码
      send = send || function () { node.send.apply(node, arguments) }

      try {
        if (typeof msg.payload === 'object' && msg.payload !== null) {
          if (msg.payload.command === 'add') {
            addInterval(msg.payload);
          } else if (msg.payload.command === 'remove') {
            removeInterval(msg.payload);
          }
        } else {
        done(new Error("Payload is not a valid JSON object"));
        }
      } catch (error) {
        console.debug(error);
      }
      
    })
      

    function addInterval (payload) {
      // 左——>右:新msg内的payload,传入的payload以及传入的payload中的'payload'
      const msg = {payload:payload.payload}
      if (!timers[payload.name]) {
        timers[payload.name] = setInterval(() => { node.send(msg);
        }, payload.intervalTime * 1000);
      } else {
        updateInterval(payload)
      }
      
    }

    function removeInterval(payload) {
      clearInterval(timers[payload.name]);
    }

    function updateInterval(payload) {
      clearInterval(timers[payload.name]);
      timers[payload.name] = setInterval(() => {
        node.send(msg);
      }, payload.intervalTime * 1000);
    }

  }

  RED.nodes.registerType("intervalSchedule",IntervalSchedule);

}