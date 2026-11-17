import { useEffect, useState } from "react";

// Actualiza las acciones cuando comienza una tutoría, sin exigir recargar la página.
export default function useNow() {
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);
    return now;
}
