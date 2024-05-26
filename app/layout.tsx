"use client";
//import
import "./globals.css";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import Login from "./login/page";
import { ConfigProvider, Flex, Layout, Spin, theme } from "antd";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

const { Content, Footer } = Layout;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [Authed, setAuthed] = useState("true");
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies(["token", "loading"]);

  useEffect(() => {
    setCookies("loading", false);
    if (cookies.token) setAuthed("true");
    else setAuthed("false");
  }, [cookies.token]);

  useEffect(() => {
    if (cookies.loading === true) setLoading(true);
    else setLoading(false);
  }, [cookies.loading]);

  return (
    <html lang='en'>
      <body style={{ margin: 0 }}>
        <ConfigProvider
          theme={{
            components: {
              Layout: {
                siderBg: "#098290",
                triggerBg: "#098290",
              },
            },
            //algorithm: theme.darkAlgorithm,
            token: {
              //colorBgBase:'#f5f5f5',
              colorText: "#08474F",
              colorPrimary: "#098290",
              borderRadius: 5,
            },
          }}>
          {Authed === "false" && <Login />}
          {Authed === "true" && (
            <Layout hasSider style={{ minHeight: "100vh" }}>
              <SideBar />

              <Layout style={{ marginLeft: 30 }}>
                <NavBar />
                <br />
                <Content
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    //background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}>
                  {loading && (
                    <>
                      <Flex style={{ minHeight: "100vh" }} gap='center' align='center' justify='center' vertical>
                        <Spin fullscreen tip='Loading' size='large' style={{ fontSize: "15vh" }}></Spin>
                      </Flex>
                      <div style={{ display: "none" }}>{children}</div>
                    </>
                  )}
                  {!loading && children} {/* content will show here */}
                </Content>
                {/* <Footer style={{ textAlign: "center" }}>
                  ©{new Date().getFullYear()} Created by Mohammad Okasha
                </Footer> */}
              </Layout>
            </Layout>
          )}
        </ConfigProvider>
      </body>
    </html>
  );
}
