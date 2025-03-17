import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config';
import { Kitten } from './kittenSlice';

// Types
export interface BattleMove {
  id: string;
  round: number;
  kittenId: string;
  abilityId: string;
  damage: number;
  isSuccess: boolean;
  isCritical: boolean;
  battleLogId: string;
  createdAt: string;
  ability: {
    id: string;
    name: string;
    description: string;
    type: string;
  };
}

export interface BattleLog {
  id: string;
  challengerId: string;
  opponentId: string;
  winnerId: string | null;
  status: string;
  seed: number;
  replayData: any;
  totalRounds: number;
  currentRound: number;
  experienceGain: number;
  createdAt: string;
  updatedAt: string;
  challenger: Kitten;
  opponent: Kitten;
  battleMoves: BattleMove[];
}

interface BattleState {
  battles: BattleLog[];
  currentBattle: BattleLog | null;
  currentRound: number;
  loading: boolean;
  error: string | null;
}

interface CreateBattleDto {
  opponentId: string;
}

// Définir l'état initial
const initialState: BattleState = {
  battles: [],
  currentBattle: null,
  currentRound: 0,
  loading: false,
  error: null,
};

// Actions asynchrones
export const fetchBattles = createAsyncThunk(
  'battles/fetchBattles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get<BattleLog[]>(`${API_URL}/battles/my-battles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des combats'
      );
    }
  }
);

export const fetchBattleById = createAsyncThunk(
  'battles/fetchBattleById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get<BattleLog>(`${API_URL}/battles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération du combat'
      );
    }
  }
);

export const createBattle = createAsyncThunk(
  'battles/createBattle',
  async ({ challengerId, data }: { challengerId: string; data: CreateBattleDto }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.post<BattleLog>(`${API_URL}/battles/${challengerId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la création du combat'
      );
    }
  }
);

// Définir le slice
const battleSlice = createSlice({
  name: 'battles',
  initialState,
  reducers: {
    clearCurrentBattle: (state) => {
      state.currentBattle = null;
      state.currentRound = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRound: (state, action: PayloadAction<number>) => {
      state.currentRound = action.payload;
    },
    incrementRound: (state) => {
      if (state.currentBattle && state.currentRound < state.currentBattle.totalRounds) {
        state.currentRound += 1;
      }
    },
    decrementRound: (state) => {
      if (state.currentRound > 0) {
        state.currentRound -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Gestion de fetchBattles
    builder
      .addCase(fetchBattles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBattles.fulfilled, (state, action: PayloadAction<BattleLog[]>) => {
        state.loading = false;
        state.battles = action.payload;
      })
      .addCase(fetchBattles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de fetchBattleById
    builder
      .addCase(fetchBattleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBattleById.fulfilled, (state, action: PayloadAction<BattleLog>) => {
        state.loading = false;
        state.currentBattle = action.payload;
        state.currentRound = 0; // Réinitialiser le round à 0 (début du combat)
      })
      .addCase(fetchBattleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de createBattle
    builder
      .addCase(createBattle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBattle.fulfilled, (state, action: PayloadAction<BattleLog>) => {
        state.loading = false;
        state.battles.unshift(action.payload); // Ajouter au début du tableau
        state.currentBattle = action.payload;
        state.currentRound = action.payload.totalRounds; // Aller à la fin du combat
      })
      .addCase(createBattle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentBattle,
  clearError,
  setCurrentRound,
  incrementRound,
  decrementRound,
} = battleSlice.actions;

export default battleSlice.reducer;
