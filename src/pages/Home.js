import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Typography } from "antd";
import { Layout, Button, Input, Form, Select, Checkbox, Switch, Space, Popconfirm} from 'antd'

import { get } from '../api/products';

import { useNavigate } from 'react-router-dom'
import ListProduct from '../components/product-tab/ListProducts'
import './styles/product.scss'

const { Content } = Layout
const { Title } = Typography;
const { Option } = Select

const dataDefault = [
  { name: 'name', value: '' },
  { name: 'symbol', value: '' },
  { name: 'address', value: '' },
  { name: 'show', value: true },
  { name: 'scam', value: false }
]

const Home = () => {
  const [metric, setMetric] = useState()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [params, setParams] = useState([])
  const [defaultValue, setDefaultValue] = useState(dataDefault)

  const [reloadProduct, setReloadProduct] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [dataSearch, setDataSearch] = useState()
  const [paramsSearch, setParamSearch] = useState({
    type: '',
    src: '',
    category: '',
    show: true,
    scam: false,
    chainName: '',
    page: 1,
    name: '',
    symbol: '',
    address: ''
  })
  const [total, setTotal] = useState(1)
  const [isSearch, setIsSearch] = useState(false)
  const [disabledBtn, setDisableBtn] = useState(false)


  const getAll = async() => {
    const product = await get(`reviews/product/all?page=${page}`)
    if (product?.data) {
      setTotal(product?.data?.count)
      setDataSearch(product?.data?.products)
      setReloadProduct(false)
      setLoading(false)
    }
  }

  // filter
  const getDataSearch = async(params) => {
    const dataSearch = await get('reviews/product/filter', params)
    if (dataSearch?.data) {
      setDataSearch(dataSearch?.data?.products)
      setIsSearch(true)
      
      //Mod add
      if (paramsSearch){
        setTotal(paramsSearch?.totalProducts)
      }else
      //get all
      {
        setTotal(dataSearch?.data?.count)
      }

      setReloadProduct(false)
      setDefaultValue(dataDefault)
      setLoading(false)
    }
  }

  const onFinish = async(values) => {
    setLoading(true)
    if (values?.address === '' && values?.category === undefined && values?.type === undefined && values?.src === undefined && values?.chainName === undefined && !values?.scam && !values?.show && values?.symbol === '' && values?.name === '') {
      // getAll()
      setIsSearch(false)
    } else {
      const params = {
        ...values,
        name: values?.name?.toLowerCase(),
        symbol: values?.symbol?.toLowerCase(),
        address: values?.address?.toLowerCase(),
        category: values?.category !== undefined ? values?.category?.toLowerCase() : '',
        chainName: values?.chainName !== undefined ? values?.chainName : '',
        src: values?.src !== undefined ? values?.src : '',
        type: values?.type !== undefined ? values?.type : '',
        page: 1,
      }
      // setParamSearch({
      //   ...values,
      //   address: values?.address?.toLowerCase(),
      //   category: values?.category?.toLowerCase(),
      //   page: 1
      // })
      setParamSearch(params)
      // getDataSearch(params)
      setIsSearch(true)
    }
    // form.resetFields()
  }

  const handleResetForm = () => {
    form.resetFields()
  }
  
  // get param form search
  useEffect(() => {
    const getParams = async() => {
        const tokens = await get(`reviews/product/list-value-fields`)
        const types = []
        tokens?.data?.type?.map((item) => (
          types.push(item?.split(', '))
        ))
        const onlyUnique = (value, index, self) => {
          return (self.indexOf(value) === index && value !== '');
        }
        const unique = types?.flat(1)?.filter(onlyUnique)

        const chains = []
        tokens?.data?.chainName?.forEach((item) => {
          if (item !== '') {
            chains.push({
              value: item,
              label: item
            })
          }
        })
        const srcs = []
        tokens?.data?.src?.forEach((item) => {
          if (item !== '') {
            srcs.push({
              value: item,
              label: item
            })
          }
        })
        const categories = []
        tokens?.data?.category?.forEach((item) => {
          if (item !== '') {
            categories.push({
              value: item,
              label: item
            })
          }
        })
        const newParams = {
            src: [ { value: '', label: 'All' }, ...srcs ],
            category: [ { value: '', label: 'All' }, ...categories ],
            chainName: [ { value: '', label: 'All' }, ...chains ],
            type: unique
        }
        setParams(newParams)
    }
    getParams()
  }, [])

  // get metric
  useEffect(() => {
    const getMetric = async() => {
      const metric = await get('reviews/metric/all')
      setMetric(metric?.data)
    }
    getMetric()
  }, [])

  useEffect(() => {
    setLoading(true)
    if (isSearch) {
      getDataSearch(paramsSearch)
    }
  }, [isSearch, reloadProduct, paramsSearch])

  // get data all
  useEffect(() => {
    setLoading(true)
    const params = {
      ...paramsSearch,
      page
    }
    if (!isSearch) {
      getAll()
    }else{
      getDataSearch(params)
    }
  }, [page, isSearch])


  const handleClickSearch = (value) => {
    setIsSearch(true)
    setParamSearch({
      ...paramsSearch,
      ...value
    })
  }


  return (
    <>
      <div className="layout-content">
        {/* {metric && ( */}
          <Row className="rowgap-vbox" gutter={[24, 0]} style={{ padding: '1rem' }}>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox" >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total tokens</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ 
                        type: 'token', 
                        scam: false, 
                        category : '', 
                        src: '', 
                        page: 1,
                        totalProducts: metric?.productTypes ? metric?.productTypes?.find((item) => item?.type === 'token')?.count : 0
                      })}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'token')?.count) : 0}
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox " >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total ICOs</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ 
                        type: 'ico', 
                        scam: false, 
                        category: '', 
                        src: '', 
                        page: 1,
                        totalProducts: metric?.productTypes ? metric?.productTypes?.find((item) => item?.type === 'ico')?.count : 0 
                      })}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'ico')?.count) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox " >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total dapp</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ 
                        type: 'project', 
                        scam: false, 
                        category: '', 
                        src: '', 
                        page: 1,
                        totalProducts: metric?.productTypes ? metric?.productTypes?.find((item) => item?.type === 'project')?.count : 0
                      })}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'project')?.count) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox " >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total coins</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ type: 'coin', scam: false, category: '', src: '', page: 1 })}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'coin')?.count) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox " >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Product others</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ 
                        category: 'other', 
                        scam: false, 
                        type: '', 
                        src: '', 
                        page: 1,
                        totalProducts: metric?.productTypes ? metric?.productTypes?.find((item) => item?.type === 'other')?.count : 0
                      })} >
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'other')?.count) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox " >
                <div className="number" style={{ cursor: 'pointer' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Scam products</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}} onClick={() => handleClickSearch({ 
                        scam: true, 
                        category: '', 
                        type: '', 
                        src:'', 
                        page: 1,
                        totalProducts: metric?.productTypes ? metric?.scamProduct : 0
                      })}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.scamProduct) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number" style={{ cursor: 'context-menu' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Mod add</span>
                      <Title level={3} style={{color: 'blue', textDecoration: 'underline'}}  
                      onClick={() => handleClickSearch({ 
                                scam: false, 
                                category: '', 
                                type: '', 
                                src:'research', 
                                page: 1, 
                                totalProducts : new Intl.NumberFormat().format(metric?.productFromBys[1]?.count) !== 'NaN'
                                          ? metric?.productFromBys[1]?.count
                                          : 0   })
                              }
                        >
                        {metric?.productTypes 
                            ? 
                                (
                                  new Intl.NumberFormat().format(metric?.productFromBys[1]?.count) !== 'NaN'
                                  ? new Intl.NumberFormat().format(metric?.productFromBys[1]?.count)
                                  : 0
                                ) 
                            : 0 
                        }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number" style={{ cursor: 'context-menu' }}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Categories</span>
                      <Title level={3}>
                        {metric?.productTypes ? new Intl.NumberFormat().format(metric?.categories?.length) : 0 }
                      </Title>
                    </Col>
                    
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        {/* )} */}
        <div>
          <Row style={{ padding: '1rem' }}>
              <Col xs="24" xl={24}>
                  <Card
                      bordered={false}
                      className="criclebox tablespace mb-24"
                      title='Products Research'
                      extra={
                        <>
                          <Button
                              disabled={loading}
                              type='primary'
                              onClick={() => navigate('../products/add-product')}
                          >
                              Add product
                          </Button>
                        </>
                      }
                  >
                    <Row>
                      <Col span={22} offset={1}> 
                          <Content
                              style={{
                                  borderRadius: '1.2rem',
                                  margin: '2rem 0',
                                  padding: '2rem',
                                  border: '1px solid rgba(0, 0, 0, 0.3)'
                              }}
                          >
                              <Form
                                form={form}
                                onFinish={onFinish}
                                fields={defaultValue}
                                // onValuesChange={handleChangeFields}
                              >
                                <Row gutter={24}>
                                  <Col span={8}>
                                      <Form.Item name="name">
                                          <Input
                                            disabled={loading}
                                            placeholder='Enter token name'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="symbol">
                                          <Input
                                            disabled={loading}
                                            placeholder='Enter token symbol'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="address">
                                          <Input
                                            disabled={loading}
                                            placeholder='Enter address'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="src">
                                          <Select
                                              placeholder="Source"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.src?.map((item) => ({
                                                value: item?.value,
                                                label: item?.label,
                                              }))}
                                              disabled={loading}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="category">
                                          <Select
                                              placeholder="Category"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.category?.map((item) => ({
                                                value: item?.value,
                                                label: item?.label,
                                              }))}
                                              disabled={loading}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="type">
                                          <Select
                                              placeholder="Type"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              disabled={loading}
                                          >
                                            <Option value=''>All</Option>
                                            {params?.type?.map((item) => (
                                              <Option value={item}>{item}</Option>
                                            ))}
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="chainName">
                                          <Select
                                              placeholder="Chain name"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.chainName?.map((item) => ({
                                                  value: item?.value,
                                                  label: item?.label,
                                              }))}
                                              disabled={loading}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="show" valuePropName="checked">
                                          <Checkbox disabled={loading}>Show</Checkbox>
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="scam" valuePropName="checked">
                                          <Checkbox disabled={loading}>Scam</Checkbox>
                                      </Form.Item>
                                  </Col>
                                </Row>
                                <div className='review-button-search'>
                                    <Form.Item>
                                        <Button disabled={disabledBtn ? disabledBtn : loading} type='primary' htmlType='submit'>Search</Button>
                                        <Button disabled={disabledBtn ? disabledBtn : loading} onClick={handleResetForm}>Reset</Button>
                                    </Form.Item>
                                </div>
                              </Form>
                          </Content>
                      </Col>
                    </Row>
                    <Row>
                        <Col span={24}> 
                            <Content
                                style={{
                                    margin: 0
                                }}
                            >
                                <ListProduct
                                  dataSearch={dataSearch}
                                  loading={loading}
                                  setReloadProduct={setReloadProduct}
                                  page={page}
                                  setPage={setPage}
                                  total={total}
                                />
                            </Content>
                        </Col>
                    </Row>
                </Card>
              </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;