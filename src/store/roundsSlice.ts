import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Round {

  myStats: {
    score: number;
    taps: number
  }
  topStats: Array<{
    score: number;
    taps: number
  }>
  round: {
    id: string;
    startTime: string;
    endTime: string;
    createdAt: string;
  }
}

interface RoundsState {
  rounds: Round[];
  currentRound: Round | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoundsState = {
  rounds: [],
  currentRound: null,
  loading: false,
  error: null,
};

const roundsSlice = createSlice({
  name: '@app/rounds',
  initialState,
  reducers: {
    setRounds(state, action: PayloadAction<Round[]>) {
      state.rounds = action.payload;
    },
    setCurrentRound(state, action: PayloadAction<Round | null>) {
      state.currentRound = action.payload;
    },
    addRound(state, action: PayloadAction<Round>) {
      state.rounds.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setRounds,
  setCurrentRound,
  addRound,
  setLoading,
  setError
} = roundsSlice.actions;

export default roundsSlice.reducer;