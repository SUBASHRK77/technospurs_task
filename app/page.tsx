"use client"
import UserTable from "./table";
import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function TableForm() {
  const [data, setData] = useState<any>(null);
  const config = {
    editable: true,
    name: {
      minLength: 3,
      maxLength: 50
    }
  };

  function generateObjectId() {
    const timestamp = (Math.floor(Date.now() / 1000)).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://66fad8b58583ac93b40a2401.mockapi.io/api/v1/linkedin-profile/linkedin-profile');
      const reversedUserData = [...response.data].reverse();
      const responseData = reversedUserData.map((obj: any) => {
        const objectId = generateObjectId();
        return { ...obj, id: objectId };
      });
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <UserTable users={data} config={config} fetch={fetchData} />
  )
}