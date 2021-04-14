import SariskaMediaTransport from "sariska-media-transport";
import Platform from "./Platform";
export function getSariskaMediaGlobalNS() {
  if (!window.SariskaMediaTransport) {
    window.SariskaMediaTransport = {};
  }

  return window.SariskaMediaTransport;
}
/**
 * Returns whether or not the current environment is a mobile device.
 *
 * @returns {boolean}
 */

export function isMobileBrowser() {
  return Platform.OS === 'android' || Platform.OS === 'ios';
}
/**
 * Checks whether the chrome extensions defined in the config file are installed or not.
 *
 * @param {Object} config - Objects containing info about the configured extensions.
 *
 * @returns {Promise[]}
 */

export function checkChromeExtensionsInstalled(config = {}) {
  const isExtensionInstalled = info => new Promise(resolve => {
    const img = new Image();
    img.src = `chrome-extension://${info.id}/${info.path}`;

    img.onload = function () {
      resolve(true);
    };

    img.onerror = function () {
      resolve(false);
    };
  });

  const extensionInstalledFunction = info => isExtensionInstalled(info);

  return Promise.all((config.chromeExtensionsInfo || []).map(info => extensionInstalledFunction(info)));
}
/**
 * Loads a script from a specific URL. The script will be interpreted upon load.
 *
 * @param {string} url - The url to be loaded.
 * @returns {Promise} Resolved with no arguments when the script is loaded and
 * rejected with the error from JitsiMeetJS.ScriptUtil.loadScript method.
 */

export function loadScript(url) {
  return new Promise((resolve, reject) => SariskaMediaTransport.util.ScriptUtil.loadScript(url,
  /* async */
  true,
  /* prepend */
  false,
  /* relativeURL */
  false,
  /* loadCallback */
  resolve,
  /* errorCallback */
  reject));
}
/**
 * Parses a specific URI which (supposedly) references a Jitsi Meet resource
 * (location).
 *
 * @param {(string|undefined)} uri - The URI to parse which (supposedly)
 * references a Jitsi Meet resource (location).
 * @public
 * @returns {{
 *     contextRoot: string,
 *     hash: string,
 *     host: string,
 *     hostname: string,
 *     pathname: string,
 *     port: string,
 *     protocol: string,
 *     room: (string|undefined),
 *     search: string
 * }}
 */

export function parseURIString(uri) {
  if (typeof uri !== 'string') {
    return undefined;
  }

  const obj = parseStandardURIString(_fixURIStringScheme(uri)); // Add the properties that are specific to a Jitsi Meet resource (location)
  // such as contextRoot, room:
  // contextRoot

  obj.contextRoot = getLocationContextRoot(obj); // The room (name) is the last component/segment of pathname.

  const {
    pathname
  } = obj; // XXX While the components/segments of pathname are URI encoded, Jitsi Meet
  // on the client and/or server sides still don't support certain characters.

  const contextRootEndIndex = pathname.lastIndexOf('/');
  let room = pathname.substring(contextRootEndIndex + 1) || undefined;

  if (room) {
    const fixedRoom = _fixRoom(room);

    if (fixedRoom !== room) {
      room = fixedRoom; // XXX Drive fixedRoom into pathname (because room is derived from
      // pathname).

      obj.pathname = pathname.substring(0, contextRootEndIndex + 1) + (room || '');
    }
  }

  obj.room = room;

  if (contextRootEndIndex > 1) {
    // The part of the pathname from the beginning to the room name is the tenant.
    obj.tenant = pathname.substring(1, contextRootEndIndex);
  }

  return obj;
}
/**
 * Determines whether analytics is enabled in a specific redux {@code store}.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean} If analytics is enabled, {@code true}; {@code false},
 * otherwise.
 */

export function isAnalyticsEnabled(stateful) {
  const {
    disableThirdPartyRequests,
    analytics = {}
  } = stateful;
  return !(disableThirdPartyRequests || analytics.disabled);
}