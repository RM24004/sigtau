/** Mensaje inline: msg = { type: "success" | "danger" | "info", text } */
function Banner({ msg, onClose }) {
    if (!msg) return null;
    return (
        <div className={`alert alert-${msg.type} alert-dismissible`} role="alert">
            {msg.text}
            {onClose && <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>}
        </div>
    );
}

export default Banner;
