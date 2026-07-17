/** 
 * This is the component used to create the hallticket modal.
 * User can download the hallticket.
 */

import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HallTicketModal = ({ showModal, hallTicket, onClose }) => {
  const navigate = useNavigate();

  const handleDownloadClick = () => {
    // Navigate to the HallTicketPdf route
    navigate("/hallTicketPdf", { state: { hallTicket } });
  };

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Hall Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your Hall Ticket has been generated successfully.</p>
        <p>Hall Ticket: {hallTicket.hallTicketNumber}</p>
          <Button variant="success"onClick={handleDownloadClick}>View & Download Hall Ticket</Button>
      </Modal.Body>
      <Modal.Footer> 
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HallTicketModal;
