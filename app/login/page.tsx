"use client";
import '../globals.css'

import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Flex,
  Form,
  FormProps,
  Input,
  Layout,
  theme,
} from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { LuFingerprint } from "react-icons/lu";

type FieldType = {
  username?: string;
  password?: string;
};

export default function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [_, setCookies] = useCookies(["token"]); //to check login

  const onFinish = async () => {
    const response = await axios.post("http://localhost:3001/login", {
      name,
      password,
    });

    if (response.data.token) {
      setCookies("token", response.data.token);
      window.localStorage.setItem("userName", response.data.userName);
    }

    setErrors(response.data.message);
  };

  return (
    <ConfigProvider>
      
      <Layout
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ width: "30vh" }}>
          <Flex justify="center" align="middle">
          <LuFingerprint  size="5em" color="#098290" />
          </Flex>
          <br />
          <br />
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form>
          <br />
          {errors && <Alert description={errors} type="error" showIcon />}
        </div>
      </Layout>
    </ConfigProvider>
  );
}
