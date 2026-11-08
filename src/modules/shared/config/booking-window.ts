/**
 * Booking window shared by the reservation form.
 *
 * This mirrors `BOOKING_HORIZON_DAYS` in `barber-api`
 * (`src/appointments/appointments.constants.ts`). The API is the authority —
 * this constant only keeps the date picker in sync so the user cannot pick a
 * date that the server will reject.
 */
export const BOOKING_HORIZON_DAYS = 14;
