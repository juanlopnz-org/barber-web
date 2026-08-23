"use client";

import { useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";
import {
  getActiveRequestCount,
  getActiveRequestMessage,
  subscribeToRequestActivity,
} from "@/modules/shared/lib/request-feedback";
import "react-toastify/dist/ReactToastify.css";

export function GlobalRequestFeedback() {
  const activeRequests = useSyncExternalStore(
    subscribeToRequestActivity,
    getActiveRequestCount,
    () => 0,
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4500}
        closeOnClick
        pauseOnFocusLoss
        draggable="touch"
        pauseOnHover
        newestOnTop
        limit={3}
        theme="light"
      />
      {activeRequests > 0 && (
        <div
          className="request-loading-indicator"
          role="status"
          aria-live="polite"
          aria-label="Cargando"
        >
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>
            {activeRequests === 1
              ? getActiveRequestMessage()
              : `Actualizando (${activeRequests})…`}
          </span>
        </div>
      )}
    </>
  );
}
