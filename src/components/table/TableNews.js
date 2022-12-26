import { notification, Table, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { del, get } from '../../api/products'
import moment from 'moment'

const TableNews = ({ dataSource, pageIndex, setPageIndex }) => {
    const PAGE_SIZE = 20
    const [page, setPage] = useState(1)
    const columns = [
        {
            title: `#`,
            // dataIndex: `index`,
            render: (_, record, index) => (
                <span>
                    {(page - 1) * PAGE_SIZE + index + 1}
                </span>
            )
        },
        {
            title: "Image",
            render: (_, record, index) => (
                <img src={record.image} alt={record.title} />
            )
        },
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Tag(s)",
            dataIndex: "tagList"
        },
        {
            title: "Description",
            dataIndex: "description"
        },
        {
            title: "Created Date",
            render: (_, item) => (
                <>
                    {moment(item.createdDate).format("LLLL")}
                </>
            )
            // dataIndex: "createdDate"
            // var date_test = new Date("2011-07-14 11:23:00".replace(/-/g,"/"));
        },
        {
            title: "Action",
            render: (_, item) => (
                <>
                    <Popconfirm
                        title="Are you sure delete this news?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={(e) => handleDeleteNews(e, item)}
                    >
                        <DeleteOutlined />
                    </Popconfirm>

                </>
            )
        }
    ]

    const handleChangePage = (pageIndex) => {
        setPage(pageIndex)
    }

    const handleDeleteNews = async (e, news) => {
        e.stopPropagation()
        let endpoint = `reviews/article?articleId=${news.id}`
        try {
            await del(endpoint)
            notification.warn({
                message: 'Warning',
                description: `delete article ${news.title}`,
            })
        } catch (e) {
            notification.warn({
                message: 'Warning',
                description: `Error when get ${endpoint}, error: ${e.message}`,
            })
        }
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource?.articles}
                pagination={{
                    defaultCurrent: 1,
                    pageSize: PAGE_SIZE,
                    showSizeChanger: false,
                    total: dataSource?.count,
                    onChange: (pageIndex) => handleChangePage(pageIndex)
                }}
            // style={{ borderRadius: '1.8rem' }}
            // className="ant-border-space"
            // scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default TableNews
