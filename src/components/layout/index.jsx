import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import menuConfig from '../../router/config'
import { useNavigate } from "react-router-dom";
import * as utils from '../../utils'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const menuItemData = utils.menuItemHandle(menuConfig)
const breadcrumbData = utils.routerHandle(menuConfig)



const Index = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys,setOpenKeys] = useState([])
  
  const { token: { colorBgContainer } } = theme.useToken();
  const navigate = useNavigate()

  useEffect(()=>{
    setOpenKeys(openMenu())
  },[])

  const activityMenu = () => {
    let currPath = window.location.pathname
    let superMenu = utils.getSuperMenuKey(menuConfig,currPath)
    if(superMenu){
      return [currPath,superMenu.path]
    }else{
      return [currPath]
    }
  }

  const openMenu = () => {
    let currPath = window.location.pathname
    let superMenu = utils.getSuperMenuKey(menuConfig,currPath)
    return [superMenu?.path]
  }

  const getBreadcrumb = () => {
    let f = breadcrumbData?.find(v => v.path === window.location.pathname)
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
        setOpenKeys(openMenu())
      }}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu theme="dark" onOpenChange={(v)=>{
          setOpenKeys(v)
        }} openKeys={openKeys} selectedKeys={activityMenu()} onClick={(v)=>{
          navigate(v.key);
        }} mode="inline" items={menuItemData} />
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
                    setTimeout(()=>{setOpenKeys(openMenu())},100)
                  }
                  
                },
              })}
            </div>
            <div>
              <Avatar style={{
                marginRight: 12
              }} size={32}>头像</Avatar>
              <span>欢迎：admin</span>
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
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Index;