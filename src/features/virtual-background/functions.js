// @flow
let filterSupport;

/**
 * Checks context filter support.
 *
 * @returns {boolean} True if the filter is supported and false if the filter is not supported by the browser.
 */
export function checkBlurSupport() {
    if (typeof filterSupport === 'undefined') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        filterSupport = typeof ctx.filter !== 'undefined';

        canvas.remove();
    }

    return filterSupport;
}

/**
 * Convert blob to base64.
 *
 * @param {Blob} blob - The link to add info with.
 * @returns {Promise<string>}
 */
export const blobToData = (blob) =>
    new Promise(resolve => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result.toString());
        reader.readAsDataURL(blob);
    });

/**
 * Convert blob to base64.
 *
 * @param {string} url - The image url.
 * @returns {Object} - Returns the converted blob to base64.
 */
export const toDataURL = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const resData = await blobToData(blob);

    return resData;
};

/**
 * Resize image and adjust original aspect ratio.
 *
 * @param {Object} base64image - Base64 image extraction.
 * @param {number} width - Value for resizing the image width.
 * @param {number} height - Value for resizing the image height.
 * @returns {Promise<string>}
 *
 */
export function resizeImage(base64image, width = 1920, height = 1080){

    // In order to work on Firefox browser we need to handle the asynchronous nature of image loading;  We need to use
    // a promise mechanism. The reason why it 'works' without this mechanism in Chrome is actually 'by accident' because
    // the image happens to be in the cache and the browser is able to deliver the uncompressed/decoded image
    // before using the image in the drawImage call.
    return new Promise(resolve => {
        const img = document.createElement('img');

        img.onload = function() {
            // Create an off-screen canvas.
            const canvas = document.createElement('canvas');

            // Set its dimension to target size.
            const context = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            // Draw source image into the off-screen canvas.
            // TODO: keep aspect ratio and implement object-fit: cover.
            context.drawImage(img, 0, 0, width, height);

            // Encode image to data-uri with base64 version of compressed image.
            resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = base64image;
    });
}

/**
 * Returns local track by media type.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {MEDIA_TYPE} mediaType - Media type.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {(Track|undefined)}
 */
 export function getLocalTrack(tracks, mediaType, includePending = false) {
    return (
        getLocalTracks(tracks, includePending)
            .find(t => t.mediaType === mediaType));
}

/**
 * Returns an array containing the local tracks with or without a (valid)
 * {@code JitsiTrack}.
 *
 * @param {Track[]} tracks - An array containing all local tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {Track[]}
 */
export function getLocalTracks(tracks, includePending = false) {
    // XXX A local track is considered ready only once it has its `jitsiTrack`
    // property set by the `TRACK_ADDED` action. Until then there is a stub
    // added just before the `getUserMedia` call with a cancellable
    // `gumInProgress` property which then can be used to destroy the track that
    // has not yet been added to the redux store. Once GUM is cancelled, it will
    // never make it to the store nor there will be any
    // `TRACK_ADDED`/`TRACK_REMOVED` actions dispatched for it.
    return tracks.filter(t => t.local && (t.jitsiTrack || includePending));
}

/**
 * Returns local video track.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
export function getLocalVideoTrack(tracks) {
    return getLocalTrack(tracks, MEDIA_TYPE.VIDEO);
}