import { createSlice } from "@reduxjs/toolkit";
import { matches } from "../utility/constants";

const initialState = {
  value: {},
  matches: matches,
  clocks: {},
};

export const matchSlicer = createSlice({
  name: "match",
  initialState,
  reducers: {
    
    initializeGame: (state, action) => {
      state.value = action.payload;
    },

    updateGameList: (state, action) => {
      state.matches = action.payload;
    },

    removeGame: (state, action) => {
      const index = action.payload; 
      state.matches = state.matches.filter((_, i) => i !== index); 
      localStorage.setItem("matches", JSON.stringify(state.matches));

    },

    addGame: (state, action) => {
      state.matches = [action.payload, ...state.matches];
      state.clocks[action.payload.seasonId] = {
        running: false,
        time: 2400,
      };
      localStorage.setItem("matches", JSON.stringify(state.matches)); // Persist matches
    },

    recordShot: (state, action) => {
      const { matchId, shot } = action.payload;
      let matchIndex = -1;
      for (let i = 0; i < state.matches.length; i++) {
        if (state.matches[i].seasonId === matchId) {
          matchIndex = i;
          break;
        }
      }
      if (matchIndex != -1) {
        state.matches[matchIndex].shotChart.shots.push(shot);
      }
    },

    logEvent: (state, action) => {
      const { matchId, event } = action.payload;
      let matchIndex = -1;
      for (let i = 0; i < state.matches.length; i++) {
        if (state.matches[i].seasonId === matchId) {
          matchIndex = i;
          break;
        }
      }
      if (matchIndex == -1) {
        return;
      }

      const shotDescs = ["pointsTwoMade", "pointsThreeMade", "freeThrowsMade"];
      if (shotDescs.includes(event.eventType)) {
        try {
          state.matches[matchIndex].shotChart.shots.push(event);
        } catch (err) {
          console.log(err);
        }

        try {
          state.matches[matchIndex].pbp[event.periodId].events.push(event);
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          state.matches[matchIndex].pbp[event.periodId].events.push(event);
        } catch (err) {
          console.error(err);
        }
      }
      localStorage.setItem("matches", JSON.stringify(state.matches));
    },

    configureTimers: (state, action) => {
      state.clocks = action.payload;
      localStorage.setItem("clocks", JSON.stringify(state.clocks));
    },

    toggleTimer: (state, action) => {
      state.clocks[action.payload].running =
        !state.clocks[action.payload].running;
    },
  },
});

export const {
  initializeGame,
  addGame,
  recordShot,
  logEvent,
  updateGameList,
  configureTimers,
  toggleTimer,
  removeGame,
} = matchSlicer.actions;

export default matchSlicer.reducer;
