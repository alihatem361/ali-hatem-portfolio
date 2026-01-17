import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchProjectData = createAsyncThunk(
  "project/fetchProjectData",
  async () => {
    // console.log(VITE_BASE_URL);
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/project`
    );
    return response.data;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjectData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProjectData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
