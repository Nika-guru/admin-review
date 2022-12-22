import React, { useState } from 'react'
import { Avatar, Typography, Button, Table } from 'antd'

import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";
import face4 from "../../assets/images/face-4.jpg";
import face5 from "../../assets/images/face-5.jpeg";

const { Title } = Typography

const ProductScam = () => {
  const [data, setData] = useState([
    {
        key: '1',
        projectName: 'BINANCE',
        image: face,
        market: 3000000000,
        volumn: 2000000000,
        reportScam: 200,
        founder: 'CZ'
    },
    {
        key: '2',
        projectName: 'BINANCE',
        image: face2,
        market: 3000000000,
        volumn: 2000000000,
        reportScam: 200,
        founder: 'CZ'
    },
    {
        key: '3',
        projectName: 'BINANCE',
        image: face3,
        market: 3000000000,
        volumn: 2000000000,
        reportScam: 200,
        founder: 'CZ'
    },
    {
        key: '4',
        projectName: 'BINANCE',
        image: face4,
        market: 3000000000,
        volumn: 2000000000,
        reportScam: 200,
        founder: 'CZ'
    },
    {
        key: '5',
        projectName: 'BINANCE',
        image: face5,
        market: 3000000000,
        volumn: 2000000000,
        reportScam: 200,
        founder: 'CZ'
    }
  ])

  const columns = [
    {
        title: "#",
        dataIndex: "key",
    },
    {
        title: "Product Name",
        dataIndex: "projectName",
        render: (_, record) => <>
        <Avatar.Group>
            <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={record?.image}
            ></Avatar>
            <div className="avatar-info">
            <Title level={5}>{record?.projectName}</Title>
            </div>
        </Avatar.Group>
        </>
    },
    {
        title: "Market",
        dataIndex: "market"
    },
    {
        title: "Volumn",
        dataIndex: "volumn"
        },
    {
        title: "Report scam",
        dataIndex: "reportScam"
    },
    {
        title: 'Founder',
        dataIndex: "founder",
    },
    {
        title: "Action",
        render: () => (
        <Button type='primary' danger>Delete</Button>
        )
    },
  ]

  return (
    <div>
       <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            style={{ borderRadius: '1.8rem' }}
            className="ant-border-space"
        />
    </div>
  )
}

export default ProductScam
