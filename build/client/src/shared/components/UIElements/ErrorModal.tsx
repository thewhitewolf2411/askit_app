import { Modal, Button } from "react-bootstrap";


const ErrorModal = (props:any) => {
  return (
    <Modal
      onHide={props.onClear}
      show={!!props.error}
    >
      <Modal.Header>
        <span>An error occured</span>
      </Modal.Header>
      <Modal.Body>
        <p>{props.error}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onClear}>Close</Button>
      </Modal.Footer>
      
    </Modal>
  );
};

export default ErrorModal;