function Modal({ children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button style={{ float: "right" }} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}
export default Modal;
