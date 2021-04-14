// @flow
import { checkChromeExtensionsInstalled, isMobileBrowser, getSariskaMediaGlobalNS, loadScript, parseURIString, isAnalyticsEnabled } from './utils/utils';
import { AmplitudeHandler, MatomoHandler } from './handlers';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';

const {analytics} = SariskaMediaTransport;

/**
 * Sends an event through the lib-jitsi-meet AnalyticsAdapter interface.
 *
 * @param {Object} event - The event to send. It should be formatted as
 * described in AnalyticsAdapter.js in lib-jitsi-meet.
 * @returns {void}
 */

export function sendAnalytics(event) {
  try {
    analytics.sendEvent(event);
  } catch (e) {
    console.warn(`Error sending analytics event: ${e}`);
  }
}
/**
 * Return saved amplitude identity info such as session id, device id and user id. We assume these do not change for
 * the duration of the conference.
 *
 * @returns {Object}
 */

export function getAmplitudeIdentity() {
  return analytics.amplitudeIdentityProps;
}
/**
 * Resets the analytics adapter to its initial state - removes handlers, cache,
 * disabled state, etc.
 *
 * @returns {void}
 */

export function resetAnalytics() {
  analytics.reset();
}
/**
 * Creates the analytics handlers.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @returns {Promise} Resolves with the handlers that have been successfully loaded.
 */

export async function createHandlers(store) {
  getSariskaMediaGlobalNS().analyticsHandlers = [];
  window.analyticsHandlers = []; // Legacy support.

  if (!isAnalyticsEnabled(store)) {
    // Avoid all analytics processing if there are no handlers, since no event would be sent.
    analytics.dispose();
    return [];
  }

  const {
    config,
    locationURL,
    token
  } = store;
  const host = locationURL ? locationURL.host : '';
  const {
     analyticsConfig={},
    deploymentInfo
  } = config;
  const {
    amplitudeAPPKey,
    blackListedEvents,
    scriptURLs,
    googleAnalyticsTrackingId,
    matomoEndpoint,
    matomoSiteID,
    whiteListedEvents
  } = analyticsConfig;
  const {
    group,
    user
  } = token;
  const handlerConstructorOptions = {
    amplitudeAPPKey,
    blackListedEvents,
    envType: deploymentInfo && deploymentInfo.envType || 'dev',
    googleAnalyticsTrackingId,
    matomoEndpoint,
    matomoSiteID,
    group,
    host,
    product: deploymentInfo && deploymentInfo.product,
    subproduct: deploymentInfo && deploymentInfo.environment,
    user: user && user.id,
    version: SariskaMediaTransport.version,
    whiteListedEvents
  };
  const handlers = [];

  if (amplitudeAPPKey) {
    try {
      const amplitude = new AmplitudeHandler(handlerConstructorOptions);
      console.log('ampl', amplitudeAPPKey, amplitude);
      analytics.amplitudeIdentityProps = amplitude.getIdentityProps();
      handlers.push(amplitude);
    } catch (e) {
      console.error('Failed to initialize Amplitude handler', e);
    }
  }

  if (matomoEndpoint && matomoSiteID) {
    try {
      const matomo = new MatomoHandler(handlerConstructorOptions);
      handlers.push(matomo);
    } catch (e) {
      console.error('Failed to initialize Matomo handler', e);
    }
  }

  if (Array.isArray(scriptURLs) && scriptURLs.length > 0) {
    let externalHandlers;

    try {
      externalHandlers = await _loadHandlers(scriptURLs, handlerConstructorOptions);
      console.log('scripturl', externalHandlers);
      handlers.push(...externalHandlers);
    } catch (e) {
      console.error('Failed to initialize external analytics handlers', e);
    }
  } // Avoid all analytics processing if there are no handlers, since no event would be sent.


  if (handlers.length === 0) {
    analytics.dispose();
  }

  console.info(`Initialized ${handlers.length} analytics handlers`);
  return handlers;
}
/**
 * Inits SariskaMediaTransport.analytics by setting permanent properties and setting the handlers from the loaded scripts.
 * NOTE: Has to be used after SariskaMediaTransport.init. Otherwise analytics will be null.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Array<Object>} handlers - The analytics handlers.
 * @returns {void}
 */

export function initAnalytics(store, handlers) {

  if (!isAnalyticsEnabled(store) || handlers.length === 0) {
    return;
  }

  const {
    config,
    token,
    roomName,
    locationURL
  } = store;
  const {
    deploymentInfo
  } = config;
  const {
    group,
    server
  } = token;
  // const {
  //   tenant
  // } = parseURIString(locationURL.href) || {};
  const permanentProperties = {};

  if (server) {
    permanentProperties.server = server;
  }

  if (group) {
    permanentProperties.group = group;
  } // Report if user is using websocket


  permanentProperties.websocket = navigator.product !== 'ReactNative' && typeof config.websocket === 'string'; // Report if we are loaded in iframe

  permanentProperties.inIframe = _inIframe(); // Report the tenant from the URL.

  //permanentProperties.tenant = tenant || '/'; // Optionally, include local deployment information based on the
  // contents of window.config.deploymentInfo.

  if (deploymentInfo) {
    for (const key in deploymentInfo) {
      if (deploymentInfo.hasOwnProperty(key)) {
        permanentProperties[key] = deploymentInfo[key];
      }
    }
  }

  analytics.addPermanentProperties(permanentProperties);
  analytics.setConferenceName(roomName); // Set the handlers last, since this triggers emptying of the cache

  analytics.setAnalyticsHandlers(handlers);

  if (!isMobileBrowser() && browser.isChrome()) {
    const bannerCfg = 'SHOW_CHROME_EXTENSION_BANNER';
    checkChromeExtensionsInstalled(bannerCfg).then(extensionsInstalled => {
      if (extensionsInstalled === null || extensionsInstalled === void 0 ? void 0 : extensionsInstalled.length) {
        analytics.addPermanentProperties({
          hasChromeExtension: extensionsInstalled.some(ext => ext)
        });
      }
    });
  }
}
console.log('anay', analytics);
/**
 * Checks whether we are loaded in iframe.
 *
 * @returns {boolean} Returns {@code true} if loaded in iframe.
 * @private
 */

function _inIframe() {
  if (navigator.product === 'ReactNative') {
    return false;
  }

  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
/**
 * Tries to load the scripts for the external analytics handlers and creates them.
 *
 * @param {Array} scriptURLs - The array of script urls to load.
 * @param {Object} handlerConstructorOptions - The default options to pass when creating handlers.
 * @private
 * @returns {Promise} Resolves with the handlers that have been successfully loaded and rejects if there are no handlers
 * loaded or the analytics is disabled.
 */


function _loadHandlers(scriptURLs = [], handlerConstructorOptions) {
  const promises = [];

  for (const url of scriptURLs) {
    promises.push(loadScript(url).then(() => {
      return {
        type: 'success'
      };
    }, error => {
      return {
        type: 'error',
        error,
        url
      };
    }));
  }

  return Promise.all(promises).then(values => {
    for (const el of values) {
      if (el.type === 'error') {
        console.warn(`Failed to load ${el.url}: ${el.error}`);
      }
    } // analyticsHandlers is the handlers we want to use
    // we search for them in the JitsiMeetGlobalNS, but also
    // check the old location to provide legacy support


    const analyticsHandlers = [...getSariskaMediaGlobalNS().analyticsHandlers, ...window.analyticsHandlers];
    const handlers = [];

    for (const Handler of analyticsHandlers) {
      // Catch any error while loading to avoid skipping analytics in case
      // of multiple scripts.
      try {
        handlers.push(new Handler(handlerConstructorOptions));
      } catch (error) {
        console.warn(`Error creating analytics handler: ${error}`);
      }
    }

    console.debug(`Loaded ${handlers.length} external analytics handlers`);
    return handlers;
  });
}