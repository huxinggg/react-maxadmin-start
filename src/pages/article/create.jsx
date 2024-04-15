import { Form, Input, Spin, Button, Select, Modal, message } from "antd"
import Quiz from './quiz'
import { useEffect, useState } from "react"
import http from '../../lib/http'
import * as apis from '../../lib/api'
import Upload from '../../components/upload'
import { cloneDeep, set } from "lodash"
import { useNavigate } from "react-router-dom";

const GradeOptions = [
  {
    label: "1st Grade",
    value: "1st Grade"
  },
  {
    label: "2nd Grade",
    value: "2nd Grade"
  },
  {
    label: "3rd Grade",
    value: "3rd Grade"
  },
  {
    label: "4th Grade",
    value: "4th Grade"
  },
  {
    label: "5th Grade",
    value: "5th Grade"
  },
  {
    label: "6th Grade",
    value: "6th Grade"
  },
  {
    label: "7th Grade",
    value: "7th Grade"
  },
  {
    label: "8th Grade",
    value: "8th Grade"
  },
  {
    label: "9th Grade",
    value: "9th Grade"
  },
  {
    label: "10th Grade",
    value: "10th Grade"
  },
  {
    label: "11th Grade",
    value: "11th Grade"
  },
  {
    label: "12th Grade",
    value: "12th Grade"
  }
]

const Index = () => {
  const { detail, setDetail } = useState({})
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const n = useNavigate()
  const content = Form.useWatch("content", form)
  const grade = Form.useWatch("grade", form)

  const loadData = async (hashId) => {
    try {
      const data = await http.get(`${apis.ARTICLE_DETAIL}?hash_id=${hashId}`)
      console.log(data)
      for (let i = 0; i < data.quiz_info.length; i++) {
        data.quiz_info[i].options = JSON.parse(data.quiz_info[i].options)
      }
      if (data.article_info.img) {
        data.article_info.img = [{ path: data.article_info.img, thumbUrl: process.env.REACT_APP_OSS_URL + "/" + data.article_info.img }]
      } else {
        data.article_info.img = []
      }
      form.setFieldsValue({
        "title": data.article_info.title,
        "lexile": data.article_info.lexile,
        "grade": data.article_info.grade,
        "content": data.article_info.content,
        "quiz": data.quiz_info,
        "img": data.article_info.img,
        "hash_id": data.article_info.hash_id,
        "subject": data.article_info.subject
      })
      setDetail(data)
    } catch (error) {

    }
  }


  useEffect(() => {
    const search = window.location.search
    const param = new URLSearchParams(search)
    if (param.get("hash_id")) {
      setLoading(true)
      loadData(param.get("hash_id")).then(() => {
        setLoading(false)
      })
    }
  }, [])

  const onSubmit = async (values) => {
    const cpV = cloneDeep(values)
    for (let i = 0; i < cpV.quiz.length; i++) {
      cpV.quiz[i].options = JSON.stringify(cpV.quiz[i].options)
    }
    cpV.quiz_json = cpV.quiz
    if (cpV.img && cpV.img.length !== 0) {
      cpV.img = cpV.img[0].path
    } else {
      cpV.img = ''
    }
    delete cpV.quiz
    setLoading(true)
    try {
      const ret = await http.post(apis.ARTICLE_UPDATE, cpV)
      message.success("操作成功")
      n("/article/list")
      // if (cpV.hash_id) {
      //   Modal.confirm({
      //     content: "更新成功",
      //     okText: "预览",
      //     cancelText: "返回列表",
      //     onOk: () => {
      //       window.open(`${process.env.REACT_APP_FRONT_URL}/article/${cpV.hash_id}`)
      //     },
      //     onCancel: () => {
      //       n("/article/list")
      //     }
      //   })
      // } else {
      //   Modal.confirm({
      //     content: "新建成功",
      //     okText: "预览",
      //     cancelText: "返回列表",
      //     onOk: () => {
      //       window.open(`${process.env.REACT_APP_FRONT_URL}/article/${ret.hash_id}`)
      //     },
      //     onCancel: () => {
      //       n("/article/list")
      //     }
      //   })
      // }
      console.log(ret)
    } catch (error) {

    }
    setLoading(false)
  }

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{
            width: "calc(50% - 12px)",
            flexShrink: 0,
            overflow: "auto",
            height: "calc(100vh - 300px)"
          }}>
            <Form.Item hidden name="hash_id">
              <Input />
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label="文章标题" name="title">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="封面" name="img">
              <Upload />
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label="蓝思值" name="lexile">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="学科" name="subject">
              <Select placeholder="请选择" options={[
                {
                  label: "Science",
                  value: "Science"
                },
                {
                  label: "Social Studies",
                  value: "Social Studies"
                },
                {
                  label: "Arts",
                  value: "Arts"
                }
              ]}></Select>
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label="年级" name="grade">
              <Select placeholder="请选择" options={GradeOptions}></Select>
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label="文章内容" name="content">
              <Input.TextArea rows={20} placeholder="请输入" />
            </Form.Item>
          </div>
          <div style={{
            width: "calc(50% - 12px)",
            flexShrink: 0,
            overflow: "auto",
            height: "calc(100vh - 300px)"
          }}>
            <Form.Item rules={[{ required: true }]} label="quiz" name="quiz">
              <Quiz onAiMake={async () => {
                try {
                  const quizData = await http.post(apis.ARTICLE_QUIZ, {
                    content,
                    grade
                  })
                  for (let i = 0; i < quizData.length; i++) {
                    quizData[i].options = JSON.parse(quizData[i].options)
                  }
                  form.setFieldValue(
                    "quiz", quizData
                  )
                  message.success("生成成功")
                } catch (error) {
                  message.success("生成失败，请重试")
                }
              }} />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default Index