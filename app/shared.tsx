import Axios from "axios";

//const api = "http://localhost:3000/api";

import { useRouter } from "next/router";

export const api ={
url: new URL(window.location.href).origin+"/api"
}

export const saveLog = async (log: string) => {
  const response = await Axios.post(`${api.url}/logs`, {
    userName: window.localStorage.getItem("userName"),
    log: log,
    time: new Date(),
  });
};

export function capitalize(str: string) {
  //abc => Abc
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function printDiv(id?: any) {
  var divToPrint = document.getElementById(id);
  var popupWin = window.open("", "_blank", "width=100000,height=10000");
  if (popupWin && divToPrint) {
    popupWin.document.write('<link href="/reports/sb-admin-2.min.css" rel="stylesheet">');
    popupWin.document.write('<link href="/reports/reports.css" rel="stylesheet">');
    popupWin.document.write("<style>body{background-color:white !important;}</style>");
    popupWin.document.write('<iframe src="/reports/report_head.html" width="100%" height="200px" frameBorder="0"></iframe>');
    popupWin.document.write('<html><body onload="window.print()"> ' + divToPrint.innerHTML + "</html>");
    popupWin.document.close();
  }
}

export const cardStyle = {
  maxHeight: "100vh",
  paddingBottom: 0,
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
};

export function formatDate(value: any) {
  if (value instanceof Date) {
    return value.toLocaleDateString() + " " + value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return value;
  }
}

export const getSearchText = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("searchText") || "";
  }
  return "";
};
export const setSearchText = (text: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("searchText", text);
  }
};
