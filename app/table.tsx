"use client";

import React, { useState } from "react";
import UserForm from './UserForm';
import { User, Config, Address } from '../types';
import "../app/pages.css"
import { Col, Modal, Row, Table } from 'antd';
import axios from 'axios';
import mongoose from 'mongoose';

interface UserTableProps {
    users: User[];
    config: Config;
    fetch: Function;
}

export default function UserTable({ users, config, fetch }: UserTableProps) {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    const onExpand = (expanded: boolean, record: User) => {
        setExpandedRowKeys(expanded ? [record.key] : []);
    };

    const toggleRow = (index: number) => {
        setExpandedRows(expandedRows.includes(index) ? expandedRows.filter((row: any) => row !== index) : [...expandedRows, index]);
    };

    const handleEdit = async (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const renderAddress = (address: Address) => {
        return (
            <>
                <p>{address.line1}</p>
                <p>{`${address.city}, ${address.state} - ${address.pin}`}</p>
            </>
        );
    };

    const handleDelete = async (user: User) => {
        const mongoose = require('mongoose');
        let objectId: any;
        if (mongoose.Types.ObjectId.isValid(user.id)) {
            objectId = new mongoose.Types.ObjectId(user.id);
        }

        if (!user || !user.id) {
            console.error('User data is missing or invalid. Cannot delete.');
            return;
        }

        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) {
            return;
        }

        try {
            const response = await axios.delete(`https://66fad8b5858383ac93b40a2401.mockapi.io/api/v1/linkedin-profile/linkedin-profile/${objectId}`);
            console.log('User deleted successfully:', response.data);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center' as const,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center' as const,
        },
        {
            title: 'LinkedIn URL',
            dataIndex: 'linkedin',
            key: 'linkedin',
            align: 'center' as const,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center' as const,
        },
        {
            title: 'Address',
            key: 'address',
            align: 'center' as const,
            render: (_: any, user: User) => (
                <>
                    <p>{user.address.line1}</p>
                    <p>
                        {user.address.city}, {user.address.state}, {user.address.pin}
                    </p>
                </>
            ),
        },
        {
            title: 'Edit',
            key: 'actions',
            align: 'center' as const,
            width: "20%",
            render: (_: any, user: User) => {
                return (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button className='cancel-button'
                            style={{
                                background: "#00a8ff",
                                color: "#fff",
                                fontSize: "15px",
                                height: "35px",
                                width: "107px",
                                fontWeight: 600
                            }}
                            onClick={() => handleEdit(user)}>Edit
                        </button>
                        <button className='cancel-button'
                            style={{
                                color: "#fff",
                                fontSize: "15px",
                                height: "35px",
                                width: "107px",
                                fontWeight: 600
                            }}
                            onClick={() => handleDelete(user)}>Delete
                        </button>
                    </div>
                );
            },
            hidden: !config.editable
        }
    ];


    return (
        <div>
            <div style={{ padding: '20px', textAlign: 'end' }}>
                <button className='cancel-button'
                    style={{
                        background: "#00a8ff",
                        color: "#fff",
                        width: "10%",
                        fontSize: "15px",
                        fontWeight: 600
                    }}
                    onClick={() => setIsFormOpen(true)}>
                    ADD
                </button>
            </div>

            {
                isFormOpen && (
                    <Modal open={isFormOpen} onCancel={() => setIsFormOpen(false)} footer={[]}>
                        <UserForm
                            user={editingUser}
                            fetch={() => fetch()}
                            onClose={() => {
                                setIsFormOpen(false);
                                setEditingUser(null);
                            }
                            }
                        />
                    </Modal>
                )}


            <Row align={'middle'} style={{ padding: "2px 63px" }}>
                <Col xs={12} md={24} lg={24} >
                    <Table columns={columns} dataSource={users} expandable={{
                        expandedRowRender: (record: any) => (
                            <p style={{ margin: 0 }}>{renderAddress(record.address)}</p>
                        ),
                        rowExpandable: (record: any) => record.name !== 'Not Expandable',
                        onExpand,
                        expandedRowKeys,
                    }} />;
                    {/* <table>
                        <thead>
                            <tr>
                                <th>Name </th>
                                < th > Email </th>
                                < th > LinkedIn URL </th>
                                < th > Gender </th>
                                < th > Address </th>
                                < th > Edit </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users?.map((user, index) => (
                                    <tr key={user.email} >
                                        <td>{user.name} </td>
                                        < td > {user.email} </td>
                                        < td > {user.linkedin} </td>
                                        < td > {user.gender} </td>
                                        < td >
                                            <button className='cancel-button'
                                                style={{
                                                    background: "#dcdde1",
                                                    color: "#000",
                                                    fontSize: "15px",
                                                    height: "35px",
                                                    width: "107px",
                                                    fontWeight: 600
                                                }} onClick={() => toggleRow(index)}>Expand</button>
                                            {
                                                expandedRows.includes(index) && (
                                                    <div>
                                                        <p>{user.address.line1} </p>
                                                        < p > {user.address.city}, {user.address.state}, {user.address.pin} </p>
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td>
                                            {
                                                config.editable && (
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                        <button className='cancel-button'
                                                            style={{
                                                                background: "#00a8ff",
                                                                color: "#fff",
                                                                fontSize: "15px",
                                                                height: "35px",
                                                                width: "107px",
                                                                fontWeight: 600
                                                            }} onClick={() => handleEdit(user)}>Edit</button>
                                                        <button className='cancel-button'
                                                            style={{
                                                                color: "#fff",
                                                                fontSize: "15px",
                                                                height: "35px",
                                                                width: "107px",
                                                                fontWeight: 600
                                                            }} onClick={() => handleDelete(user)}>Delete</button>
                                                    </div>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table> */}
                </Col>
            </Row>
        </div>
    );
}
