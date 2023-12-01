import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import Header from '../components/Header'
import { _getUsers } from '../services/user';
import { Table, Button } from 'react-bootstrap';

function Home() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await _getUsers();

                setUsers(userData.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <Layout>
            <Header />
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Home Page</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user,key) => (
                            <tr key={user.id}>
                                <td>{key+1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{(user.created_at)}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleEdit(user.id)}>
                                        Edit
                                    </Button>{' '}
                                    <Button variant="danger" onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Layout>
    );
}

export default Home;