"use client";
const PageName = "Users";
import { api } from "@/app/shared";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { saveLog, capitalize, printDiv, cardStyle } from "@/app/shared";

//icons
import { BsPlusLg } from "react-icons/bs";
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { FaPrint } from "react-icons/fa6";

//Styling
import { Alert, Button, Card, Checkbox, Divider, Form, Input, Modal, Popconfirm, Result, Table, TableColumnsType, message } from "antd";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [allUsersData, setAllUsersData] = useState<any>([]);
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [userRules, setUserRules] = useState<{ [key: string]: number }>({
    //users rules
    users: 0,
    hotels: 0,
  });

  const [Loading, setLoading] = useState(true); // to show loading before get data form db
  const [edit, setEdit] = useState(false); // if true update else save new
  const [searchText, setSearchText] = useState(""); // to search on table
  const [Errors, setErrors] = useState<any>({ connectionError: "", saveErrors: "", confirmPasswordError: "" });
  const [_, setCookies] = useCookies(["loading"]); //for loading page
  const [form] = Form.useForm(); // to reset form after save or close

  type Field = {
    label: string;
    name: string;
    type?: string; // Optional type for Input (e.g., "text", "email", "password")
    rules?: any[]; // Optional validation rules for Form.Item
  };

  const fields: Field[] = [
    { label: "Name", name: "name", type: "text", rules: [{ required: true }] },
    { label: "Email", name: "email", type: "email", rules: [{ type: "email", required: true }] },
    { label: "Password", name: "password", type: "password", rules: [{ required: true }] },
    { label: "Confirm Password", name: "password2", type: "password", rules: [{ required: true, message: "Passwords not match!" }] },
  ];

  const filteredFields = fields.filter((field) => field.name !== "password2" && field.name !== "password");
  const columns: TableColumnsType<any> = [
    ...filteredFields.map((field) => ({
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
              type='primary'
              danger
              onClick={() => {
                setUserData(record);
              }}
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
              setUserData(record);
              form.setFieldsValue({
                name: record.name,
                email: record.email,
                rules: record.rules,
              });
              setEdit(true);
              setUserRules(record.rules);
              showModal();
            }}
          />
        </>
      ),
    },
  ];

  // const columns: TableColumnsType<DataType> = [
  //   {
  //     title: "ID",
  //     dataIndex: "_id",
  //     hidden: true,
  //   },
  //   {
  //     title: "Name",
  //     dataIndex: "name",
  //   },
  //   {
  //     title: "Email",
  //     dataIndex: "email",
  //   },
  //   {
  //     title: "Actions",
  //     dataIndex: "Actions",
  //     key: "Actions",
  //     align: "center",
  //     className: "no_print",
  //     fixed: "right",
  //     render: (_, record) => (
  //       <>
  //         <Popconfirm
  //           title={"Delete the " + PageName.slice(0, -1)}
  //           description={"Are you sure to delete  " + record.name + "?"}
  //           onConfirm={() => {
  //             remove(record._id);
  //           }}
  //           okText='Yes, Remove'
  //           cancelText='No'>
  //           <Button
  //             type='primary'
  //             onClick={() => {
  //               setUserData(record);
  //             }}
  //             danger
  //             shape='circle'
  //             size='small'
  //             icon={<DeleteOutlined />}
  //           />
  //         </Popconfirm>
  //         <> </>
  //         <Button
  //           type='primary'
  //           shape='circle'
  //           size='small'
  //           icon={<EditOutlined />}
  //           onClick={() => {
  //             setUserData(record);
  //             form.setFieldsValue({
  //               name: record.name,
  //               email: record.email,
  //               rules: record.rules,
  //             });
  //             setEdit(true);
  //             setUserRules(record.rules);
  //             showModal();
  //           }}
  //         />
  //       </>
  //     ),
  //   },
  // ];

  useEffect(() => {
    getData();
  }, []);
  function handleCheckboxChange(key: string) {
    //on check/unchek rule box change userRules values
    setUserRules((prevState) => ({
      ...prevState,
      [key]: prevState[key] === 0 ? 1 : 0,
    }));
  }
  async function getData() {
    setLoading(true);
    try {
      const response = await Axios.get(`${api.url}/users`);
      setAllUsersData(response.data);
    } catch (error) {
      setErrors({ ...Errors, connectionError: error });
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setCookies("loading", false);

    }
  }

  const filteredData = allUsersData.filter((user:any) => {
    // Implement your search logic here
    const searchTextLower = searchText.toLowerCase(); // Case-insensitive search
    return (
      // Search relevant fields
      user.name.toLowerCase().includes(searchTextLower) || user.email.toLowerCase().includes(searchTextLower)
      // Add more fields as needed based on your data structure
    );
  });
  async function save() {
    setErrors({ ...Errors, saveErrors: "" });
    const response = await Axios.post(`${api.url}/users`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      rules: userRules,
    });
    if (response.data.message === "Saved!") {
      getData();
      saveLog("save new user: " + userData.name);
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
    const response = await Axios.put(`${api.url}/users`, {
      _id: userData._id,
      name: form.getFieldValue("name"),
      email: form.getFieldValue("email"),
      password: form.getFieldValue("password"),
      rules: userRules,
    });
    if (response.data.message === "Updated!") {
      getData();
      toast.remove();
      toast.success(response.data.message, {
        position: "top-center",
      });
      saveLog("update user: " + userData.name);
      setEdit(false);
      return true; // to close modal form
    } else {
      setErrors({ ...Errors, saveErrors: response.data.message });
      return false; // to keep modal form open
    }
  }
  async function remove(id: string) {
    Axios.delete(`${api.url}/users/${id}`).then((res) => {
      saveLog("remove user: " + userData.name);
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
    if (userData.password != userData.password2) {
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
      setUserData((prevData) => ({ ...prevData, [field]: e.target.value }));
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
        width={400}
        maskClosable={false} //not close by click out of modal
        footer={[]}>
        <Card>
          {/* <Form form={form} layout='vertical' style={{ maxWidth: 600, textAlign: "center" }} validateMessages={validateMessages} onFinish={handleOk}>
            <Form.Item label='Name' name='name' rules={[{ required: true }]}>
              <Input onChange={handleInputChange("name")} />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  type: "email",
                  required: true,
                },
              ]}>
              <Input onChange={handleInputChange("email")} />
            </Form.Item>
            <Form.Item label='Password' name='password' rules={[{ required: true }]}>
              <Input.Password onChange={handleInputChange("password")} />
            </Form.Item>
            <Form.Item
              label='Confirm Password'
              name='password2'
              rules={[{ required: true, message: "Passwords not match!" }]}
              validateStatus={Errors.confirmPasswordError}>
              <Input.Password onChange={handleInputChange("password2")} />
            </Form.Item>
            <Card title='Rules'>
              {Object.keys(userRules).map((key) => (
                <label style={{ padding: 10 }} key={key}>
                  <Checkbox checked={userRules[key] === 1} onChange={() => handleCheckboxChange(key)} />
                  {" " + capitalize(key)}
                </label>
              ))}
            </Card>
            <br />
            <Divider />
            <Form.Item style={{ marginBottom: -40, textAlign: "right" }}>
              <Button onClick={handleCancel} icon={<CloseOutlined />} />
              <> </>
              <Button type='primary' htmlType='submit' icon={<SaveOutlined />} />
            </Form.Item>
          </Form> */}

          <Form form={form} layout='vertical' style={{ maxWidth: 600, textAlign: "center" }} validateMessages={validateMessages} onFinish={handleOk}>
            {fields.map((field) => (
              <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                {field.type ? (
                  <Input onChange={handleInputChange(field.name)} type={field.type} />
                ) : (
                  <Input onChange={handleInputChange(field.name)} />
                )}
              </Form.Item>
            ))}
            <Card title='Rules'>
              {Object.keys(userRules).map((key) => (
                <label style={{ padding: 10 }} key={key}>
                  <Checkbox checked={userRules[key] === 1} onChange={() => handleCheckboxChange(key)} />
                  {" " + capitalize(key)}
                </label>
              ))}
            </Card>
            <br />
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
