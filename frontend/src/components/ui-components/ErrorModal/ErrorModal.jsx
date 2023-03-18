import React from "react";
import Button from "../Button";
import Modal from "../Modal";

import "./ErrorModal.scss";

const ErrorModal = (props) => {
    return (
        <Modal
            onCancel={props.onClear}
            headerClass={"error-modal"}
            header="An Error Occurred!"
            show={!!props.error}
            footer={
                <Button role="button" onClick={props.onClear}>
                    Okay
                </Button>
            }
        >
            <p className="error-text">{props.error}</p>
        </Modal>
    );
};

export default ErrorModal;
