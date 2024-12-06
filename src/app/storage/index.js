import { configureStore } from "@reduxjs/toolkit";
import matchSlicer from "./matchSlicer";

export const store = configureStore({
  reducer: { matchSlicer },
});
