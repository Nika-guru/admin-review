import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Card, Button, Layout, Select, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { get } from '../../api/products'
import TableNews from '../../components/table/TableNews'

const { Content } = Layout

const News = () => {
  const [form] = Form.useForm()
  const onFinishForm = (values) => {
    form.resetFields()
  }
  const navigate = useNavigate()
  const [newsTags, setNewsTags] = useState([])
  const [news, setNews] = useState([])
  const [reloadNews, setReloadNews] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)


  //Get tags
  useEffect(() => {
    let getNewsTag = async () => {
      let endpoint = `reviews/article/all-tag`
      try {
        let resp = await get(endpoint)
        let newsTags = resp?.data?.filter((item) => item !== '')
        setNewsTags(newsTags)
      } catch (e) {
        notification.warn({
          message: 'Warning',
          description: `Error when get ${endpoint}, error: ${e.message}`,
        })
      }
    }
    //run code(function above)
    getNewsTag()
  }, [reloadNews])

  //Get aritcle by page index
  useEffect(() => {
    const getNewsByPage = async (tags, pageIndex) => {
      let endpoint = `reviews/article/get-by-tag?listtag=${tags}&page=${pageIndex}`
      try {
        const resp = await get(endpoint)
        const news = (resp?.data != null) ? resp?.data : []
        setNews(news)
        setReloadNews(false)
      } catch (e) {
        notification.warn({
          message: 'Warning',
          description: `Error when get ${endpoint}, error: ${e.message}`,
        })
      }
    }

    let tagSearch = ``
    let pageIndex = 1
    getNewsByPage(tagSearch, pageIndex)
  }, [reloadNews])

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinishForm}
      >
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="News"
              extra={
                <>
                  <Button
                    type='primary'
                    onClick={() => navigate(`../news/add-news`)}
                  >
                    Add news
                  </Button>
                </>
              }
            >
              <Row>
                <Col span={24}>
                  <Select
                    placeholder='Choose Tag(s)'
                    mode='multiple'
                    showArrow
                    style={{ width: '100%' }}
                    onChange={
                      (model) => {
                        // alert(model)
                      }
                    }
                    options={newsTags?.map((item) => ({
                      value: item,
                      label: item,
                    }))}

                  >
                  </Select>
                </Col>
              </Row>
              <br />
              <br />
              <Row>
                <Col span={24}>
                  <Content
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <TableNews
                      dataSource={news}
                      pageIndex={pageIndex}
                      setPageIndex={setPageIndex}
                    />
                  </Content>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )

}

export default News
