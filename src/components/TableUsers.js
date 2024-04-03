import _, { debounce } from 'lodash';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchAllUser } from '../services/UserService';
import ModalAddNew from './ModalAddNew';
import ModalConfirm from './ModalConfirm';
import ModalEditUser from './ModalEditUser';
import './TableUser.scss';

const TableUsers = (props) => {
  const [listUser, setListUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState('asc');
  const [sortField, setSortField] = useState('id');

  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUser([user, ...listUser]);
  };

  useEffect(() => {
    // Call API
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setListUser(res.data);
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUser);
    let index = listUser.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUser(cloneListUser);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUser(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUser(cloneListUser);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUser(cloneListUser);
    } else {
      getUsers(1);
    }
  }, 500);

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUser && listUser.length > 0) {
      result.push(['Id', 'Email', 'First name', 'Last name']);
      listUser.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });

      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (file.type !== 'text/csv') {
        toast.error('Only accept csv file!');
        return;
      }
      if (file.size > maxSizeInBytes) {
        toast.error('File size exceeds 5MB.');
        return;
      }
      // Parse local CSV file
      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (rawCSV[0][0] !== 'email' || rawCSV[0][1] !== 'first_name' || rawCSV[0][2] !== 'last_name') {
                toast.error('Wrong format header csv file!');
              } else {
                let importData = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    importData.push(obj);
                  }
                });
                setListUser(rawCSV);
              }
            } else {
              toast.error('Wrong format csv file!');
            }
          } else {
            toast.error('Not found data on csv file!');
          }
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <span>
          <b>List User:</b>
        </span>
        <div className="group-btns mt-sm-2 mt-2">
          <label htmlFor="import-btn" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i>Import
          </label>
          <input id="import-btn" type="file" hidden onChange={(event) => handleImportCSV(event)} />

          <CSVLink
            filename={'users.csv'}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i className="fa-solid fa-file-arrow-down"></i>Export
          </CSVLink>

          <button className="btn btn-success" onClick={() => setIsShowModalAddNew(true)}>
            <i className="fa-solid fa-circle-plus"></i>Add new
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email"
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'id')}></i>
                    <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'id')}></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="sort-header">
                  <span>Email</span>
                  <span>
                    <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'email')}></i>
                    <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'email')}></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="sort-header">
                  <span>First Name</span>
                  <span>
                    <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'first_name')}></i>
                    <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'first_name')}></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="sort-header">
                  <span>Last Name</span>
                  <span>
                    <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'last_name')}></i>
                    <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'last_name')}></i>
                  </span>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listUser &&
              listUser.length > 0 &&
              listUser.map((item, index) => {
                return (
                  <tr key={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button className="btn btn-warning mx-3" onClick={() => handleEditUser(item)}>
                        <i className="fa-solid fa-user-pen"></i>Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteUser(item)}>
                        <i className="fa-solid fa-trash"></i>Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< Previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />

      <ModalAddNew show={isShowModalAddNew} handleClose={handleClose} handleUpdateTable={handleUpdateTable} />

      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />

      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUsers;
