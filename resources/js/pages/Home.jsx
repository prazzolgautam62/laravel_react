import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import Header from '../components/Header'
import { _createUser, _deleteUser, _getUsers, _updateUser } from '../services/user';
import { Table, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';

function Home() {

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [params, setParams] = useState({
        search_query: '',
        sort_by: 'id',
        sort_direction: 'asc',
    });

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
    });

    const handleClose = () => {
        setIsEdit(false);
        setFormData({ id: null, name: '', email: '' })
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
        try {
            const user = await _createUser(formData);
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleEdit = async (user) => {
        setFormData({ id: user.id, name: user.name, email: user.email });
        setIsEdit(true);
        setShow(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const user = await _updateUser(formData.id, formData);
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const fetchData = async (url='') => {
        try {
            const userData = await _getUsers(url, params);
            setUsers(userData.data.data);
            let { data, ...pagination } = userData.data;
            setPagination(pagination)
            setUsers(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handlePageChange = (url) => {
        fetchData(url);
    };

    useEffect(() => {
        fetchData();
    }, [params.sort_by, params.sort_direction]);

    useEffect(() => {
        if ((params.search_query.length > 2 || params.search_query.length == 0) && users.length)
            fetchData();
    }, [params.search_query]);


    return (
        <Layout>
            <Header />
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="mt-auto"><Button variant="outline-success" onClick={() => handleAdd()}>Add User</Button>{' '}</div>
                    <div className="d-flex">
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Search</Form.Label>
                            <Form.Control type="text" placeholder="Search ..." value={params.search_query} onChange={(e) => setParams({ ...params, search_query: e.target.value })}
                            />
                        </Form.Group>&nbsp;
                        <div>
                            <Form.Label>Sort By</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e) => setParams({ ...params, sort_by: e.target.value })}>
                                <option value="id">Id</option>
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                            </Form.Select>
                        </div>&nbsp;
                        <div>
                            <Form.Label>Direction</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e) => setParams({ ...params, sort_direction: e.target.value })}>
                                <option value="asc">Asc</option>
                                <option value="desc">desc</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
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
                                <td>{pagination.from + key}</td>
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
                <div className="d-flex justify-content-between align-items-center">
                <div class="text-muted">{ pagination.from } - { pagination.to } of { pagination.total }</div>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(pagination.first_page_url)} disabled={pagination.current_page == 1} />
                        <Pagination.Prev
                            onClick={() => handlePageChange(pagination.prev_page_url)}
                            disabled={!pagination.prev_page_url}
                        />
                        <Pagination.Item active>
                            {pagination.current_page}
                        </Pagination.Item>

                        <Pagination.Next
                            onClick={() => handlePageChange(pagination.next_page_url)}
                            disabled={!pagination.next_page_url}
                        />
                        <Pagination.Last onClick={() => handlePageChange(pagination.last_page_url)} disabled={pagination.current_page == pagination.last_page} />
                    </Pagination>
                </div>
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