import "./Banner.css";

/** Mensaje inline: msg = { type: "success" | "danger" | "info", text } */
function Banner({ msg, onClose }) {
    if (!msg) return null;
    return (
        <div
            className={`banner banner--${msg.type}`}
            role={msg.type === "danger" ? "alert" : "status"}
        >
            <p className="banner__text">{msg.text}</p>
            {onClose && (
                <button
                    type="button"
                    className="banner__close"
                    aria-label="Cerrar mensaje"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            )}
        </div>
    );
}

export default Banner;