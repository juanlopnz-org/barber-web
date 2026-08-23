import { toast } from "react-toastify";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

const activeRequests = new Map<string, string>();
const listeners = new Set<() => void>();

function notifyActivity() {
  listeners.forEach((listener) => listener());
}

export function subscribeToRequestActivity(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActiveRequestCount() {
  return activeRequests.size;
}

export function getActiveRequestMessage() {
  return Array.from(activeRequests.values()).at(-1) ?? "Actualizando…";
}

export function startRequestActivity(requestId: string, message: string) {
  if (typeof window === "undefined" || activeRequests.has(requestId)) return;
  activeRequests.set(requestId, message);
  notifyActivity();
}

export function stopRequestActivity(requestId?: string) {
  if (!requestId || !activeRequests.delete(requestId)) return;
  notifyActivity();
}

function normalizedUrl(url?: string) {
  return url?.replace(/^\//, "") ?? "";
}

export function getLoadingMessage(method: HttpMethod, url?: string) {
  const path = normalizedUrl(url);
  if (method === "get") return "Actualizando información…";
  if (path.includes("auth/login")) return "Iniciando sesión…";
  if (path.includes("auth/register")) return "Creando tu cuenta…";
  if (path.includes("check-phone")) return "Verificando tu número…";
  if (path.includes("appointments") && method === "post") return "Guardando tu reserva…";
  if (path.includes("recurring-bookings")) return "Actualizando reservas recurrentes…";
  if (path.includes("blocked-times")) return "Actualizando bloqueo…";
  if (path.includes("schedules")) return "Actualizando horario…";
  if (path.includes("services")) return "Actualizando servicio…";
  return "Guardando cambios…";
}

export function getSuccessMessage(method: HttpMethod, url?: string) {
  const path = normalizedUrl(url);
  if (path.includes("auth/login")) return "¡Bienvenido de nuevo!";
  if (path.includes("auth/register")) return "Tu cuenta fue creada correctamente.";
  if (path.includes("check-phone")) return "Número verificado correctamente.";
  if (path.includes("auth/logout")) return "Sesión cerrada correctamente.";
  if (path.includes("appointments") && method === "post") return "Tu cita fue reservada correctamente.";
  if (path.includes("appointments") && method === "patch") return "El estado de la cita fue actualizado.";
  if (path.includes("recurring-bookings") && method === "post") return "La reserva recurrente fue creada correctamente.";
  if (path.includes("recurring-bookings") && method === "delete") return "La reserva recurrente fue cancelada.";
  if (path.includes("recurring-bookings") && method === "patch") return "Las reservas recurrentes fueron actualizadas.";
  if (path.includes("blocked-times") && method === "post") return "El bloqueo fue creado correctamente.";
  if (path.includes("blocked-times") && method === "delete") return "El bloqueo fue eliminado.";
  if (path.includes("schedules") && method === "post") return "El horario fue creado correctamente.";
  if (path.includes("schedules") && method === "patch") return "El horario fue actualizado.";
  if (path.includes("schedules") && method === "delete") return "El horario fue eliminado.";
  if (path.includes("services") && method === "post") return "El servicio fue creado correctamente.";
  if (path.includes("services") && method === "patch") return "El servicio fue actualizado.";
  if (path.includes("services") && method === "delete") return "El servicio fue eliminado.";
  return "Los cambios se guardaron correctamente.";
}

const fallbackMessages: Record<number, string> = {
  400: "Revisa los datos ingresados e inténtalo nuevamente.",
  401: "Tu sesión venció o tus datos de acceso no son válidos.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No encontramos la información solicitada.",
  409: "No se pudo completar la acción porque la información ya cambió o existe.",
  422: "Revisa la información ingresada e inténtalo nuevamente.",
  500: "Ocurrió un problema en el servidor. Inténtalo de nuevo en unos minutos.",
};

const technicalMessage = /^(network error|request failed|unauthorized|forbidden|not found|internal server error|invalid |missing |failed |service |barber |appointment |schedule |profile )/i;

export function getFriendlyErrorMessage(status?: number, backendMessage?: unknown) {
  const message = Array.isArray(backendMessage)
    ? backendMessage.find((item): item is string => typeof item === "string")
    : typeof backendMessage === "string"
      ? backendMessage
      : undefined;

  // Los mensajes redactados para usuarios se respetan; los técnicos del API
  // se sustituyen por una explicación clara en español.
  if (message && !technicalMessage.test(message) && /[áéíóúñ¿¡]/i.test(message)) {
    return message;
  }

  if (!status) {
    return "No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.";
  }

  return fallbackMessages[status] ?? "No fue posible completar la solicitud. Inténtalo nuevamente.";
}

export function showSuccessToast(message: string, requestId: string) {
  if (typeof window === "undefined") return;
  toast.success(message, { toastId: `success:${requestId}` });
}

export function showErrorToast(message: string, requestKey: string) {
  if (typeof window === "undefined") return;
  toast.error(message, { toastId: `error:${requestKey}` });
}
