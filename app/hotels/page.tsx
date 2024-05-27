"use client";
const PageName = "Hotels";
const api = "http://localhost:3001";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { saveLog, capitalize, printDiv, cardStyle } from "@/app/shared";

//icons
import { BsPlusLg } from "react-icons/bs";
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { FaPrint } from "react-icons/fa6";

//Styling
import { Alert, Button, Card, Checkbox, Col, Divider, Form, Input, Modal, Popconfirm, Result, Row, Table, TableColumnsType, message } from "antd";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [allHotelsData, setAllHotelsData] = useState([]);
  const [hotelData, setHotelData] = useState<any>({});
  const [Loading, setLoading] = useState(true); // to show loading before get data form db
  const [edit, setEdit] = useState(false); // if true update else save new
  const [searchText, setSearchText] = useState(""); // to search on table
  const [Errors, setErrors] = useState<any>({ connectionError: "", saveErrors: "", confirmPasswordError: "" });
  const [_, setCookies] = useCookies(["loading"]); //for loading page
  const [form] = Form.useForm(); // to reset form after save or close

  //Field to use in table and form
  type Field = {
    label: string;
    name: string;
    type?: string;
    rules?: any[]; // Optional validation rules for Form.Item
  };

  const fields: Field[] = [
    { label: "Name", name: "name", type: "text", rules: [{ required: true }] },
    { label: "Country", name: "country", type: "text", rules: [{ required: true }] },
    { label: "City", name: "city", type: "text", rules: [{ required: true }] },
    { label: "Area", name: "area", type: "text", rules: [{ required: true }] },
    { label: "Rate", name: "rate", type: "text", rules: [{ required: true }] },
    { label: "Allotment", name: "allotment", type: "number", rules: [{ required: true }] },
    { label: "Notes", name: "notes", type: "text", rules: [{ required: true }] },
    { label: "User", name: "user", type: "text", rules: [{ required: true }] },
  ];

  const columns: TableColumnsType<any> = [
    ...fields.map((field) => ({
      title: field.label,
      dataIndex: field.name,
    })),
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      align: "center",
      className: "no_print",
      fixed: "right",
      render: (_, record) => (
        <>
          <Popconfirm
            title={"Delete the " + PageName.slice(0, -1)}
            description={"Are you sure to delete  " + record.name + "?"}
            onConfirm={() => {
              remove(record._id);
            }}
            okText='Yes, Remove'
            cancelText='No'>
            <Button
              onClick={() => {
                setHotelData(record);
              }}
              type='primary'
              danger
              shape='circle'
              size='small'
              icon={<DeleteOutlined />}
            />
          </Popconfirm>{" "}
          <Button
            type='primary'
            shape='circle'
            size='small'
            icon={<EditOutlined />}
            onClick={() => {
              setHotelData(record);
              form.setFieldsValue({
                ...record,
              });
              setEdit(true);
              showModal();
            }}
          />
        </>
      ),
    },
  ];

  const formFields = fields.filter((field) => field.name !== "user");

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    try {
      const response = await Axios.get(`${api}/hotels`);
      setAllHotelsData(response.data);
    } catch (error) {
      setErrors({ ...Errors, connectionError: error });
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
      setCookies("loading", false);
    }
  }

  //search in all [fields]
  const filteredData = allHotelsData.filter((hotel) => {
    const searchTextLower = searchText.toLowerCase();

    let searchMatches = false;
    fields.forEach((field) => {
      const hotelValue: any = hotel[field.name];
      if (typeof hotelValue === "string" && hotelValue.toLowerCase().includes(searchTextLower)) {
        searchMatches = true;
        return;
      }
    });

    return searchMatches;
  });

  async function save() {
    setErrors({ ...Errors, saveErrors: "" });
    const response = await Axios.post(`${api}/hotels`, {
      ...hotelData,
    });
    if (response.data.message === "Saved!") {
      getData();
      saveLog("save new hotel: " + hotelData.name);
      toast.remove(); // remove any message on screen
      toast.success(response.data.message, {
        position: "top-center",
      });
      return true; // to close modal form
    } else {
      setErrors({ ...Errors, saveErrors: response.data.message });

      return false; // to keep modal form open
    }
  }
  async function update() {
    setErrors({ ...Errors, saveErrors: "" });
    const response = await Axios.put(`${api}/hotels`, {
      ...hotelData,
    });
    if (response.data.message === "Updated!") {
      getData();
      toast.remove();
      toast.success(response.data.message, {
        position: "top-center",
      });
      saveLog("update hotel: " + hotelData.name);
      setEdit(false);
      return true; // to close modal form
    } else {
      setErrors({ ...Errors, saveErrors: response.data.message });
      return false; // to keep modal form open
    }
  }
  async function remove(id: string) {
    Axios.delete(`${api}/hotels/${id}`).then((res) => {
      saveLog("remove hotel: " + hotelData.name);
      getData();
      message.success("Removed");
    });
  }
  // Modal //////////
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function showModal() {
    setErrors({ ...Errors, saveErrors: "" });
    setErrors({ ...Errors, confirmPasswordError: "" });
    setIsModalOpen(true);
  }
  async function handleOk() {
    if (hotelData.password != hotelData.password2) {
      //check pass is same
      setErrors({ ...Errors, confirmPasswordError: "error" });
      return;
    }
    setErrors({ ...Errors, confirmPasswordError: "" });

    if (!edit) {
      if (await save()) {
        setIsModalOpen(false);
        form.resetFields();
      }
    } else {
      if (await update()) {
        setIsModalOpen(false);
        form.resetFields();
      }
    }
  }
  function handleCancel() {
    setIsModalOpen(false);
    setEdit(false);
    form.resetFields();
  }
  //////////////////

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "not valid email!",
      number: "not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const modalTitle = useMemo(() => (edit ? "Edit " : "Add ") + PageName.slice(0, -1), [edit]);

  const handleInputChange = useCallback(
    (field: any) => (e: any) => {
      setHotelData((prevData: any) => ({ ...prevData, [field]: e.target.value }));
    },
    []
  );

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={handleCancel}
        width={1300}
        maskClosable={false} //not close by click out of modal
        footer={[]}>
        <Card>

          <Form form={form} layout='vertical' style={{ textAlign: "center" }} validateMessages={validateMessages} onFinish={handleOk}>
          <Row>
            {formFields.map((field) => (
             
                <Col key={field.name} xs={{ flex: "100%" }} sm={{ flex: "50%" }} md={{ flex: "40%" }} lg={{ flex: "20%" }}  style={{padding:5}} >
                  <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                    {field.type ? (
                      <Input onChange={handleInputChange(field.name)} type={field.type} />
                    ) : (
                      <Input onChange={handleInputChange(field.name)} />
                    )}
                  </Form.Item>
                </Col>
              
            ))}
            </Row>
            <Divider />
            <Form.Item style={{ marginBottom: -40, textAlign: "right" }}>
              <Button onClick={handleCancel} icon={<CloseOutlined />} />
              <> </>
              <Button type='primary' htmlType='submit' icon={<SaveOutlined />} />
            </Form.Item>{" "}
          </Form>
          <br />
          {Errors.saveErrors && <Alert description={Errors.saveErrors} type='error' showIcon />}
        </Card>
      </Modal>
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
            <Button type='text' title='Add' onClick={showModal} icon={<BsPlusLg size={"1em"} />}></Button>
          </>
        }>
        {!Errors.connectionError && (
          <>
            <Input.Search placeholder='Search...' onChange={(e) => setSearchText(e.target.value)} style={{ paddingBottom: 5 }} allowClear />
            <Table
              id='test'
              size='small'
              columns={columns}
              dataSource={filteredData}
              loading={Loading}
              pagination={{ hideOnSinglePage: true, pageSize: 5 }}
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
