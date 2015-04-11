var state = {};
module.exports.state = state;
module.exports.getState = function (group) {
    if (!state.hasOwnProperty(group)) {
        state[group] = {};
    }
    return state[group];
};

module.exports.resetState = function (group) {
    state[group] = {};
};