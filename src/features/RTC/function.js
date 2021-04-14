import { initSDKConfig } from "../../constants";

/**
 * Checks whether rtcstats is enabled or not.
 *
 * @param {Function|Object} stateful.
 * @returns {boolean}
 */
 export function isRtcstatsEnabled() {
    // TODO: Remove when rtcstats is fully compatible with mobile.
    if (navigator.product === 'ReactNative') {
        return false;
    }

    const {analytics} = initSDKConfig;

    return analytics && analytics.rtcstatsEnabled || false;
}