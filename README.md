# node-red-contrib-interval-schedule
A node that configures scheduled tasks based on received MQTT messages

## FEATURES
- Received MQTT Example

| "command" |  "name"  | "intervalTime" | "payload" |
|:---------:|:--------:|:--------------:|:---------:|
| "add" | "TimerForTemp" | "10" | "reportName":"Temp","plcInputList":[ {},{},{} ] |
| "remove" | "TimerForTemp" | igenored \|\| null | igenored \|\| null |

- JSON
```json 
{
  "command":"add",
  "name":"o2",
  "intervalTime": "4",
  "payload": {
    "reportName" : "温度",
    "plcInputList" : [
      {
        "func": "ReadBool",
        "body": {
          "name": "HIM_Auto_Manual",
          "address": "DB8.DBX0.0"
        }
      },
      {
        "func": "ReadFloat",
        "body": {
          "name": "Output_Angle[1]",
          "address": "DB8.DBW266"
        }
      }
    ]
  }
} 
```

- Output  

| "payload" |
|:---------:|
|any(Object)|

- JSON
``` json
{
  "reportName":"温度",
  "plcInputList": [
    {
    "func":"ReadBool",
    "body": {
      "name":"HIM_Auto_Manual",
      "address":"DB8.DBX0.0"
      }
    },
    {
      "func":"ReadFloat",
      "body": {
        "name":"Output_Angle[1]",
        "address":"DB8.DBW266"
      }
    }
  ]
}
```

_When adding a timer with a name that already exists, it will be updated to the last received_  
_添加一个名字已存在的计时器时，会更新为上一次收到的_  
