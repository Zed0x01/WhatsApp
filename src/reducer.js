export const initialState = {
  user: null,
  roomIds: null,
};
export const ACTIONS = {
  SET_USER: "SET_USER",
  SET_RO_ID: "SET_RO_ID",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER: {
      return {
        ...state,
        user: action.user,
      };
    }
    case ACTIONS.SET_RO_ID: {
      return {
        ...state,
        roomIds: action.room,
      };
    }
    default:
      return state;
  }
};

export default reducer;
