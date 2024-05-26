"use client";
import { Row, Col, Card } from "antd";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { LiaHotelSolid } from "react-icons/lia";

import { useCookies } from "react-cookie";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import "../globals.css";
import { useRouter } from "next/navigation";

const api = "http://localhost:3001";

export default function App() {
  const router = useRouter();
  const [_, setCookies] = useCookies(["loading"]); //for loading page

  const btns = [
    { title: "Users", icon: <UserOutlined />, url: "/users", color: "green" },
    { title: "Hotels", icon: <LiaHotelSolid />, url: "/hotels", color: "" },
    { title: "Logs", icon: <FaRegEye />, url: "/logs", color: "" },
  ];
  const [allBtn, setAllBtn] = useState([]);

  return (
    <>

      <Row gutter={12}>
        {Object.keys(btns).map((key:any) => (
          <Col key={key} xs={{ flex: "100%" }} sm={{ flex: "30%" }} lg={{ flex: "30%" }} xl={{ flex: "20%" }}>
            <Link className='animated-button' onClick={() => setCookies("loading", true)} href={btns[key].url}>
              <Card
                bordered={true}
                style={{
                  fontSize: "2vh",
                  color: "white",
                }}>
                {btns[key].icon} {btns[key].title}
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
