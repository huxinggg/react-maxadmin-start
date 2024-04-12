import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import menuConfig from '../../router/config'
import { useNavigate } from "react-router-dom";
import * as utils from '../../utils'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';

import { globalContext } from '../context'

const { Header, Content, Footer, Sider } = Layout;


const Index = (props) => {
  const c = useContext(globalContext)
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys,setOpenKeys] = useState([])
  const { token: { colorBgContainer } } = theme.useToken();
  const navigate = useNavigate()

  useEffect(()=>{
    setOpenKeys(openMenu(c?.roleData?.permission_info))
  },[c?.roleData])

  const activityMenu = (mdata) => {
    let currPath = window.location.pathname
    let superMenu = utils.getSuperMenuKey(mdata,currPath)
    if(superMenu){
      return [currPath,superMenu.path]
    }else{
      return [currPath]
    }
  }

  const openMenu = (mdata) => {
    let currPath = window.location.pathname
    let superMenu = utils.getSuperMenuKey(mdata,currPath)
    return [superMenu?.path]
  }

  const getBreadcrumb = () => {
    let f = menuConfig[window.location.pathname]
    if(f && f.breadcrumb){
      return f.breadcrumb
    }
    return <></>
  }

  return (
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => {
          setCollapsed(value)
          setOpenKeys(openMenu(c?.roleData?.permission_info))
        }}>
          <div
            style={{
              height: 32,
              margin: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              color: "#FFF",
              textAlign: "center",
              lineHeight: "32px",
              borderRadius: 20,
              fontWeight: "bold",
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: "0 12px"
            }}
          >{process.env.REACT_APP_NAME}</div>
          <Menu theme="dark" onOpenChange={(v)=>{
            setOpenKeys(v)
          }} openKeys={openKeys} selectedKeys={activityMenu(c?.roleData?.permission_info)} onClick={(v)=>{
            navigate(v.key);
          }} mode="inline" items={c?.menuItemData || []} />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              paddingLeft: 24,
              paddingRight: 24
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: () => {
                    setCollapsed(!collapsed)
                    if(collapsed){
                      setTimeout(()=>{setOpenKeys(openMenu(c?.roleData?.permission_info))},100)
                    }
                    
                  },
                })}
              </div>
              <div>
                <Avatar style={{
                  marginRight: 12
                }} src={c?.roleData?.avatar} size={32}>头像</Avatar>
                <span>欢迎：{c?.roleData?.name}</span>
                <Button onClick={()=>{
                  localStorage.removeItem("token")
                  navigate("/login")
                }} type="link">注销</Button>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            {
              getBreadcrumb()
            }
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              {props.children}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            {process.env.REACT_APP_BOTTOM_DESC}
          </Footer>
        </Layout>
      </Layout>
  );
};
export default Index;