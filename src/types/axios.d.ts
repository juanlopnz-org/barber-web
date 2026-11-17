/**
 * Augmentation of the axios request configuration.
 *
 * The API client supports a `feedback` flag that turns off the global
 * loading indicator and the success/error toasts for a single request.
 * It is meant for background polling (watching a status, refreshing a QR),
 * where a toast per request would be noise.
 *
 * Declaring it here makes `api.get(url, { feedback: false })` type-safe
 * instead of requiring a cast at every call site.
 */
import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /**
     * Whether this request should report its progress to the user.
     *
     * `false` disables both the global loading indicator and the
     * success/error toast for this request only.
     */
    feedback?: boolean;
  }
}
