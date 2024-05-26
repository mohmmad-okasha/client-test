import { Menu, MenuProps, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa6";
import { LiaHotelSolid } from "react-icons/lia";

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

type MenuItem = Required<MenuProps>["items"][number];

export default function App() {
  const router = useRouter();
  const [_, setCookies] = useCookies(["loading"]); //for loading page


  const items: MenuItem[] = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => {
        setCookies("loading", true);
        router.push("/users");
      },
    },
    {
      key: "3",
      icon: <LiaHotelSolid />,
      label: "Hotels",
      onClick: () => {
        setCookies("loading", true);
        router.push("/hotels");
      },
    },
    {
      key: "4",
      icon: <FaRegEye />,
      label: "Logs",
      onClick: () => {
        router.push("/logs");
        setCookies("loading", true);
      },
    },
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        { key: "5", label: "Option 5" },
        { key: "6", label: "Option 6" },
        { key: "7", label: "Option 7" },
        { key: "8", label: "Option 8" },
      ],
    },
    {
      key: "sub2",
      label: "Navigation Two",
      icon: <AppstoreOutlined />,
      children: [
        { key: "9", label: "Option 9" },
        { key: "10", label: "Option 10" },
        {
          key: "sub3",
          label: "Submenu",
          children: [
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
          ],
        },
      ],
    },
  ];

  //collaps or not on button click
  const [collaps, setCollaps] = useState(false);
  const changeCollaps = () => {
    setCollaps(!collaps);
  };

  return (
    <>
      <Sider breakpoint='lg' collapsedWidth='0' collapsed={collaps} onCollapse={changeCollaps} style={{ position: "sticky", top: 0, zIndex: 1 ,width:"80vh"}}>
        <div style={{ padding: 20, textAlign: "center" }}>
          <img src='http://hotels.crown-tourism.com/static/img/logo_white.png' width='80%' />
        </div>

        <Menu theme='dark' style={{ backgroundColor: "#098290" }} defaultSelectedKeys={["1"]} mode='inline' items={items} />
      </Sider>
    </>
  );
}
