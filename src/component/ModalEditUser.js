import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalEditUser = (props) => {
  const { show, handleClose, dataUserEdit } = props;
  const [name, setName] = useState('');
  const [job, setJob] = useState('');

  const handleEditUser = () => {

  }

  useEffect(() => {
    if (show) {
        setName(dataUserEdit.first_name)
    }
  }, [dataUserEdit])

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div class="mb-3">
              <label className="form-label">Job</label>
              <input type="text" class="form-control" value={job} onChange={(event) => setJob(event.target.value)} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEditUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditUser;
