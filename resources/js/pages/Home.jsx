import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import Header from '../components/Header'
import { _createUser, _deleteUser, _getUsers, _updateUser } from '../services/user';
import { Table, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Home() {

    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
    });

    const handleClose = () => {
        setIsEdit(false);
        setFormData({id: null, name: '', email: ''})
        setShow(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete the user ?")) return;
        try {
            const user = await _deleteUser(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAdd = async () => {
        setIsEdit(false);
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try{
            const user = await _createUser(formData);
            handleClose();
            fetchData();
        } catch(error){
            console.error('Error adding user:', error);
        }
    };

    const handleEdit = async (user) => {
        setFormData({id: user.id, name: user.name, email: user.email});
        setIsEdit(true);
        setShow(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); 
        try{
            const user = await _updateUser(formData.id,formData);
            handleClose();
            fetchData();
        } catch(error){
            console.error('Error updating user:', error);
        }
    };

    const fetchData = async () => {
        try {
            const userData = await _getUsers();
            setUsers(userData.data.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <Layout>
            <Header />
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Home Page</h2>
                <Button variant="outline-success" onClick={() => handleAdd()}>Add User</Button>{' '}
                <Table striped bordered hover className='mt-2'>
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
                        {users.map((user, key) => (
                            <tr key={user.id}>
                                <td>{key + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{(user.created_at)}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleEdit(user)}>
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
                <Modal show={show} onHide={handleClose}>
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    } />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button type="Submit" variant="primary" onClick={isEdit ? handleUpdate : handleSubmit}>
                                {isEdit ? 'Update' : 'Submit'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
}

export default Home;