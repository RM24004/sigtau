export const fmtTime = (t) => (t ? t.slice(0, 5) : "");
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString("es-SV") : "");
