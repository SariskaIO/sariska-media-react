
export function set(state, property, value) {
    return _set(state, property, value, /* copyOnWrite */ true);
}

function _set(
    state,
    property,
    value,
    copyOnWrite) {
// Delete state properties that are to be set to undefined. (It is a matter
// of personal preference, mostly.)
if (typeof value === 'undefined'
        && Object.prototype.hasOwnProperty.call(state, property)) {
    const newState = copyOnWrite ? { ...state } : state;

    if (delete newState[property]) {
        return newState;
    }
}

if (state[property] !== value) {
    if (copyOnWrite) {
        return {
            ...state,
            [property]: value
        };
    }

    state[property] = value;
}

return state;
}

export function toState(stateful) {
    if (stateful) {
        if (typeof stateful === 'function') {
            return stateful();
        }

        const { getState } = stateful;

        if (typeof getState === 'function') {
            return getState();
        }
    }

    return stateful;
}