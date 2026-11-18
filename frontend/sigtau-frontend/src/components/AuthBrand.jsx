import { TONES } from "../utils/careerTone";

/** Panel de marca compartido por Login y Register (estilos en Login.css). */
function AuthBrand() {
    return (
        <aside className="login__brand">
            <div className="login__tiles" aria-hidden="true">
                {[..."SIGTAU"].map((letter, i) => {
                    const tone = TONES[i % TONES.length];
                    return (
                        <span
                            key={i}
                            className="login__tile"
                            style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                        >
                            {letter}
                        </span>
                    );
                })}
            </div>
            <div>
                <p className="login__name">SIGTAU</p>
                <p className="login__tagline">
                    Sistema de Gestión de Tutorías: encuentra e inscríbete en la tutoría que necesitas.
                </p>
            </div>
        </aside>
    );
}

export default AuthBrand;