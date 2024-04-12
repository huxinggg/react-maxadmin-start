import { Radio, Input, Divider, Button, Space, Spin } from "antd"

import {
  DeleteOutlined,
} from '@ant-design/icons';
import { cloneDeep } from "lodash";
import { useState } from "react";


const Index = (props) => {
  const { value = [], onChange, onAiMake } = props
  const [loading, setLoading] = useState(false)
  return (
    <Spin spinning={loading}>
      {
        value?.map((v, k) => (
          <div key={k} style={{ marginBottom: 32 }}>
            <Divider style={{ marginTop: 4 }}>第{k + 1}题 <Button size="small" icon={<DeleteOutlined />} onClick={() => {
              const cpV = cloneDeep(value)
              cpV.splice(k, 1)
              onChange(cpV)
            }} danger></Button></Divider>
            <div style={{
              display: "flex",
              alignItems: "center",
              margin: "8px 0"
            }}>
              <div style={{ width: 38, flexShrink: 0 }}>问题:</div>
              <Input onChange={(e) => {
                const cpV = cloneDeep(value)
                cpV[k].question = e.target.value
                onChange(cpV)
              }} allowClear value={v.question} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              margin: "8px 0"
            }}>
              <div style={{ width: 58, flexShrink: 0 }}>知识点:</div>
              <Input onChange={(e) => {
                const cpV = cloneDeep(value)
                cpV[k].knowledge = e.target.value
                onChange(cpV)
              }} allowClear value={v.knowledge} />
            </div>
            <div>
              {
                v.options.map((v2, k2) => (
                  <div key={k2} style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0"
                  }}>
                    <Radio onChange={(e) => {
                      if (!v2.option) {
                        return
                      }
                      const cpV = cloneDeep(value)
                      cpV[k].answer = v2.option
                      onChange(cpV)
                    }} checked={v2.option === v.answer} style={{ width: 60, flexShrink: 0, marginRight: 6 }}>答案</Radio>
                    <Input onChange={(e) => {
                      const cpV = cloneDeep(value)
                      cpV[k].options[k2].option = e.target.value
                      onChange(cpV)
                    }} style={{ width: 35, flexShrink: 0, marginRight: 6 }} value={v2.option} />
                    <Input onChange={(e) => {
                      const cpV = cloneDeep(value)
                      cpV[k].options[k2].txt = e.target.value
                      onChange(cpV)
                    }} allowClear value={v2.txt} />
                    <Button onClick={() => {
                      const cpV = cloneDeep(value)
                      cpV[k].options.splice(k2, 1)
                      onChange(cpV)
                    }} icon={<DeleteOutlined />} style={{ width: 30, flexShrink: 0, marginLeft: 6 }} danger></Button>
                  </div>
                ))
              }
              <Button style={{ width: "100%" }} onClick={() => {
                const cpV = cloneDeep(value)
                cpV[k].options.push({
                  option: "",
                  txt: ""
                })
                onChange(cpV)
              }}>添加选项</Button>
            </div>
          </div>
        ))
      }
      <Space style={{ width: "100%" }} direction="vertical">
        <Button style={{ width: "100%" }} onClick={() => {
          const cpV = cloneDeep(value)
          cpV.push({
            "knowledge": "",
            "question": "",
            "options": [],
            "answer": "C"
          })
          onChange(cpV)
        }} type="primary">添加quiz</Button>
        <Button style={{ width: "100%" }} type="dashed" onClick={async () => {
          setLoading(true)
          await onAiMake()
          setLoading(false)
        }}>Ai生成</Button>
      </Space>
    </Spin>
  )
}

export default Index