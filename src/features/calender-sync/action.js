import { initSDKConfig } from "../../constants";
import { loadGoogleAPI } from "../google-api/actions";
import { googleCalendarApi } from "./googleCalendar";

/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
 export function bootstrapCalendarIntegration() {
    return () => {

        // if (!isCalendarEnabled(state)) {
        //     return Promise.reject();
        // }

        const {
            googleApiApplicationClientID
        } = initSDKConfig;

        const integrationReady = true;
        

        return Promise.resolve()
            .then(() => {
                if (googleApiApplicationClientID) {
                    return loadGoogleAPI();
                }
            })
            .then(() => {
                // if (!integrationType || integrationReady) {
                //     return;
                // }

                const integrationToLoad
                    = googleCalendarApi;

                if (!integrationToLoad) {
                    console.log('integration not loaded');;

                    return;
                }

                return integrationToLoad._isSignedIn()
                    .then(signedIn => {
                        if (signedIn) {
                            setIntegrationReady(integrationType);
                            updateProfile(integrationType);
                        } else {
                            clearCalendarIntegration();
                        }
                    });
            });
    };
}

/**
 * Signals signing in to the specified calendar integration.
 *
 * @param {string} calendarType - The calendar integration which should be
 * signed into.
 * @returns {Function}
 */
 export function signIn() {
    return () => {
        const integration = googleCalendarApi;

        if (!integration) {
            return Promise.reject('No supported integration found');
        }

        return integration.load()
            .then(() => integration.signIn())
            .then(() => updateProfile(calendarType))
            .then(() => refreshCalendar())
            .then(() => sendAnalytics(createCalendarConnectedEvent()))
            .catch(error => {
                logger.error(
                    'Error occurred while signing into calendar integration',
                    error);

                return Promise.reject(error);
            });
    };
}