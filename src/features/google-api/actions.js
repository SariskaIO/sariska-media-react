// @flow

import { initSDKConfig } from '../../constants';
import {
    SET_GOOGLE_API_PROFILE,
    SET_GOOGLE_API_STATE
} from './actionTypes';
import { GOOGLE_API_STATES } from './constants';
import googleApi from './googleApi.web';

/**
 * Retrieves the current calendar events.
 *
 * @param {number} fetchStartDays - The number of days to go back when fetching.
 * @param {number} fetchEndDays - The number of days to fetch.
 */
export function getCalendarEntries(
        fetchStartDays, fetchEndDays) {
    return () =>
        googleApi.get()
        .then(() =>
            googleApi._getCalendarEntries(fetchStartDays, fetchEndDays));
}

/**
 * Loads Google API.
 *
 * @returns {Function}
 */
export function loadGoogleAPI() {
        googleApi.get()
        .then(() => {
            const {
                enableCalendarIntegration,
                googleApiApplicationClientID
            } = initSDKConfig;

                return googleApi.initializeClient(
                    googleApiApplicationClientID, enableCalendarIntegration);
        })
        .then(() => console.log('stateloaded', GOOGLE_API_STATES.LOADED))
        .then(() => googleApi.isSignedIn())
        .then(isSignedIn => {
            if (isSignedIn) {
                console.log('signed_in',GOOGLE_API_STATES.SIGNED_IN);
            }
        });
}

/**
 * Sets the current Google API state.
 *
 * @param {number} googleAPIState - The state to be set.
 * @param {Object} googleResponse - The last response from Google.
 */
export function setGoogleAPIState(
        googleAPIState, googleResponse) {
    return {
        type: SET_GOOGLE_API_STATE,
        googleAPIState,
        googleResponse
    };
}

/**
 * Forces the Google web client application to prompt for a sign in, such as
 * when changing account, and will then fetch available YouTube broadcasts.
 *
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
export function showAccountSelection() {
    return () =>
        googleApi.showAccountSelection();
}

/**
 * Prompts the participant to sign in to the Google API Client Library.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function signIn() {
    return () => googleApi.get()
            .then(() => googleApi.signInIfNotSignedIn())
            .then(() => console.log(
                'googleAPIState', GOOGLE_API_STATES.SIGNED_IN
            ));
}

/**
 * Logs out the user.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function signOut() {
    return () =>
        googleApi.get()
            .then(() => googleApi.signOut())
            .then(() => {
                console.log('googleAPIState', GOOGLE_API_STATES.LOADED)
                });
}

/**
 * Updates the profile data that is currently used.
 *
 */
export function updateProfile() {
    return () => googleApi.get()
        .then(() => googleApi.signInIfNotSignedIn())
        .then(() => console.log('state', googleAPIState
        ))
        .then(() => googleApi.getCurrentUserProfile())
        .then(profile => {
            console.log(
                'profileEmail', profile.getEmail()
            )
        })
}

/**
 * Updates the calendar event and adds a location and text.
 *
 * @param {string} id - The event id to update.
 * @param {string} calendarId - The calendar id to use.
 * @param {string} location - The location to add to the event.
 */
export function updateCalendarEvent(
        id, calendarId, location) {
    return () =>console.log('updated calender entry', googleApi._updateCalendarEntry(id, calendarId, location, text));
}
