"use client";
const PageName = "Logs";
const api = "http://localhost:3001";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { cardStyle, printDiv, formatDate } from "@/app/shared";

//icons
import { FaPrint } from "react-icons/fa6";

//Styling
import {
  DatePicker,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Row,
  Select,
  Table,
  TableColumnsType,
  message,
  DatePickerProps,
} from "antd";
import toast, { Toaster } from "react-hot-toast";

interface DataType {
  key: React.Key;
  _id: string;
  log: string;
  userName: string;
  time: Date;
}

export default function App() {
  const [allLogsData, setAllLogsData] = useState<any>([]);
  const [Users, setUsers] = useState([]);
  const [logData, setLogData] = useState({
    _id: "",
    log: "",
    userName: "",
    time: "",
  });

  const [Loading, setLoading] = useState(true); // to show loading before get data form db
  const [searchText, setSearchText] = useState(""); // to search on table
  const [searchUserName, setSearchUserName] = useState(""); // to search by userName
  const [searchTime, setSearchTime] = useState({ from: "", to: "" }); // to search by userName
  const [Errors, setErrors] = useState<any>({ connectionError: "", saveErrors: "", confirmPasswordError: "" });
  const [_, setCookies] = useCookies(["loading"]); //for loading page
  const [form] = Form.useForm(); // to reset form after save or close
  const [filteredData, setFilteredData] = useState([]);

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "_id",
      hidden: true,
    },
    {
      title: "Log",
      dataIndex: "log",
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (_, record) => {
        return formatDate(new Date(record.time));
      },
    },
  ];

  useEffect(() => {
    if(window.location.pathname === '/logs'){
    setCookies("loading", false);}

    getUsers();
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    try {
      const response = await Axios.get(`${api}/logs`);
      setAllLogsData(response.data);
    } catch (error) {
      setErrors({ ...Errors, connectionError: error });
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getUsers() {
    setLoading(true);
    try {
      const response = await Axios.get(`${api}/users/list`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fromDate = new Date(searchTime.from);
    const toDate = new Date(searchTime.to);

    const filtered = allLogsData.filter((log:any) => {
      const searchTextLower = searchText.toLowerCase(); // Case-insensitive search for general text
      const searchUserNameLower = searchUserName.toLowerCase(); // Case-insensitive search for username
      const logTime = new Date(log.time); // Convert log time to Date object

      const matchesText = log.userName.toLowerCase().includes(searchTextLower) || log.log.toLowerCase().includes(searchTextLower);

      const matchesUserName = log.userName.toLowerCase().includes(searchUserNameLower);

      let matchesTime = true; // to search time only if select range else return all
      if (searchTime.from && searchTime.to) matchesTime = logTime >= fromDate && logTime <= toDate;

      return matchesText && matchesUserName && matchesTime;
    });

    setFilteredData(filtered);
  }, [allLogsData, searchText, searchUserName, searchTime]);

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const { RangePicker } = DatePicker;

  return (
    <>
      <div>
        <Toaster />
      </div>

      <Card
        title={PageName}
        style={cardStyle}
        extra={
          <>
            <Button
              type='text'
              title='Print'
              onClick={() => {
                printDiv("test");
              }}
              icon={<FaPrint size={"1em"} />}></Button>
          </>
        }>
        {!Errors.connectionError && (
          <>
            <Collapse
              size='small'
              items={[
                {
                  key: "1",
                  label: "Search",
                  children: (
                    <Row>
                      <Col xs={{ flex: "100%" }} sm={{ flex: "50%" }} lg={{ flex: "30%" }} style={{ padding: 5 }}>
                        <Input.Search placeholder='Search...' onChange={(e) => setSearchText(e.target.value)} allowClear />
                      </Col>
                      <Col xs={{ flex: "100%" }} sm={{ flex: "50%" }} lg={{ flex: "20%" }} style={{ padding: 5 }}>
                        <Select
                          onChange={(newValue) => setSearchUserName(newValue)}
                          placeholder='User'
                          showSearch
                          filterOption={filterOption}
                          options={Users}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col xs={{ flex: "100%" }} sm={{ flex: "50%" }} lg={{ flex: "50%" }} style={{ padding: 5 }}>
                        <RangePicker
                          style={{ width: "100%" }}
                          onChange={(value, dateString) => {
                            console.log("Selected Time: ", value);
                            setSearchTime({ from: dateString[0], to: dateString[1] });
                          }}
                          //showTime
                        />
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
            <br />
            {searchTime.from}
            {searchTime.to}
            <Table
              id='test'
              size='small'
              columns={columns}
              dataSource={filteredData}
              loading={Loading}
              pagination={{ hideOnSinglePage: true, pageSize: 30 }}
              scroll={{ x: "calc(300px + 50%)", y: 500 }}
              rowKey={(record) => record._id}
            />
          </>
        )}
        {Errors.connectionError && <Result status='warning' title={"Can't Load Data :" + Errors.connectionError} />}
      </Card>
    </>
  );
}
