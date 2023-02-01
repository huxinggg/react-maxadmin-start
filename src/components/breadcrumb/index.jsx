import React from 'react';
import { Breadcrumb } from 'antd';

const style = {
    margin: '16px 0',
}

const breadcrumbConfig = {
    '/home': <Breadcrumb style={style}>
        <Breadcrumb.Item>蓝思科技</Breadcrumb.Item>
        <Breadcrumb.Item>蓝思科技</Breadcrumb.Item>
    </Breadcrumb>
}

export default breadcrumbConfig


