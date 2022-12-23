import React from "react";
import { Layout, Button, Row, Col, Typography, Form, Input, notification } from "antd";
import { setCookie, STORAGEKEY } from "../utils/storage";
import { post } from "../api/products";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;
const SignIn = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async(values) => {
    try{
      document.getElementById(`btnSignin`).setAttribute('disabled', 'disabled')
      const signin = await post('reviews/signin', values)
      const token = signin?.data[0]?.token
      if (token) {
        setCookie(STORAGEKEY.ACCESS_TOKEN, token)
        setCookie(STORAGEKEY.USER_INFO, signin?.data[1])
        form.resetFields()
        navigate('/')
      }
    }catch(e){
      notification.warn({
        message: 'Warm',
        description: `Sai mật khẩu hoặc email`
      })
      document.getElementById(`btnSignin`).removeAttribute('disabled')
    }
  }
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  }

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin" style={{ marginTop: "10%" }}>
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    id="btnSignin"
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  {/* Don't have an account?{" "}
                  <Link to="/sign-up" className="text-dark font-bold">
                    Sign Up
                  </Link> */}
                </p>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}
export default SignIn
