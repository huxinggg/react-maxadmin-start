import { Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import * as apis from '../../lib/api'

const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传照片
      </div>
    </div>
);

const Index = (props) => {
    const { value = [], onChange, maxCount = 1 } = props
    return (
        <Upload
            action={process.env.REACT_APP_API_HOST + apis.UPLOAD}
            listType="picture-card"
            name="file"
            headers={{
                'Authorization': localStorage.getItem('token')
            }}
            fileList={value}
            onChange={(v) => {
                // if(v.file.xhr){
                //     let response = JSON.parse(v.file.xhr.response)
                //     console.log(response?.data?.path)
                // }
                for (let i=0;i<v?.fileList?.length;i++){
                    let item = v.fileList[i]
                    if(item.xhr){
                        try {
                            let response = JSON.parse(item.xhr.response)
                            item.path = response?.data?.path
                        } catch (error) {
                            item.path = item.xhr.response?.data?.path
                        }
                    }
                }
                onChange(v.fileList)
            }}
        >
            {value.length >= maxCount ? null : uploadButton}
        </Upload>
    )
}

export default Index