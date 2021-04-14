// @flow

import { virtualBackground } from '.';
import { getLocalVideoTrack } from '../base/tracks';
import { createVirtualBackgroundEffect } from '../stream-effects/virtual-background';

import { BACKGROUND_ENABLED, SET_VIRTUAL_BACKGROUND } from './actionTypes';

/**
 * Signals the local participant activate the virtual background video or not.
 *
 * @param {boolean} enabled - If true enables video background, false otherwise.
 * @returns {Promise}
 */
export function toggleBackgroundEffect(enabled, tracks) {
    return async function() {
        

        const { jitsiTrack } = getLocalVideoTrack(tracks);

        try {
            if (enabled) {
                await jitsiTrack.setEffect(await createVirtualBackgroundEffect(virtualBackground));
                backgroundEnabled(true);
            } else {
                await jitsiTrack.setEffect(undefined);
                backgroundEnabled(false);
            }
        } catch (error) {
            backgroundEnabled(false);
            console.error('Error on apply backgroun effect:', error);
        }
    };
}

/**
 * Sets the selected virtual background image object.
 *
 * @param {Object} virtualSource - Virtual background image source.
 * @param {boolean} isVirtualBackground - Indicate if virtual image is activated.
 * @returns {{
 *     type: SET_VIRTUAL_BACKGROUND,
 *     virtualSource: string,
 *     isVirtualBackground: boolean,
 * }}
 */
export function setVirtualBackground(virtualSource, isVirtualBackground) {
    return {
        type: SET_VIRTUAL_BACKGROUND,
        virtualSource,
        isVirtualBackground
    };
}

/**
 * Signals the local participant that the background effect has been enabled.
 *
 * @param {boolean} backgroundEffectEnabled - Indicate if virtual background effect is activated.
 * @returns {{
 *      type: BACKGROUND_ENABLED,
 *      backgroundEffectEnabled: boolean,
 * }}
 */
export function backgroundEnabled(backgroundEffectEnabled) {
    return {
        type: BACKGROUND_ENABLED,
        backgroundEffectEnabled
    };
}
