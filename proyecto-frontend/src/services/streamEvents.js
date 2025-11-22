// src/services/streamEvents.js

// Nombre del evento para regalos
const STREAM_GIFT_EVENT = "streamGift";

/**
 * Emite un evento de "regalo enviado" (modo demo / frontend).
 * payload: { canal, user, regalo }
 */
export function emitGiftEvent(payload) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent(STREAM_GIFT_EVENT, {
            detail: payload,
        })
    );
}

/**
 * Se suscribe a los eventos de regalos.
 * handler recibe: { canal, user, regalo }
 * Devuelve una función para desuscribirse.
 */
export function subscribeToGiftEvents(handler) {
    if (typeof window === "undefined") return () => { };

    const wrappedHandler = (event) => {
        if (event && event.detail) {
            handler(event.detail);
        }
    };

    window.addEventListener(STREAM_GIFT_EVENT, wrappedHandler);

    return () => {
        window.removeEventListener(STREAM_GIFT_EVENT, wrappedHandler);
    };
}
