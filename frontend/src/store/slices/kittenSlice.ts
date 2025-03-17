import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config';

// Types
export interface Ability {
  id: string;
  name: string;
  description: string;
  type: string;
  power: number;
  accuracy: number;
  cooldown: number;
  createdAt: string;
  updatedAt: string;
}

export interface KittenStats {
  id: string;
  wins: number;
  losses: number;
  draws: number;
  kittenId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Kitten {
  id: string;
  name: string;
  level: number;
  experience: number;
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
  skillPoints: number;
  avatarUrl?: string;
  userId: string;
  abilities: Ability[];
  stats?: KittenStats;
  createdAt: string;
  updatedAt: string;
}

interface KittenState {
  kittens: Kitten[];
  currentKitten: Kitten | null;
  loading: boolean;
  error: string | null;
}

interface CreateKittenDto {
  name: string;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  avatarUrl?: string;
}

interface UpdateKittenDto {
  name?: string;
  avatarUrl?: string;
}

interface AssignSkillPointsDto {
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
}

// Définir l'état initial
const initialState: KittenState = {
  kittens: [],
  currentKitten: null,
  loading: false,
  error: null,
};

// Actions asynchrones
export const fetchKittens = createAsyncThunk(
  'kittens/fetchKittens',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get<Kitten[]>(`${API_URL}/kittens`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des chatons'
      );
    }
  }
);

export const fetchKittenById = createAsyncThunk(
  'kittens/fetchKittenById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get<Kitten>(`${API_URL}/kittens/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération du chaton'
      );
    }
  }
);

export const createKitten = createAsyncThunk(
  'kittens/createKitten',
  async (kittenData: CreateKittenDto, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.post<Kitten>(`${API_URL}/kittens`, kittenData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la création du chaton'
      );
    }
  }
);

export const updateKitten = createAsyncThunk(
  'kittens/updateKitten',
  async ({ id, data }: { id: string; data: UpdateKittenDto }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.patch<Kitten>(`${API_URL}/kittens/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la mise à jour du chaton'
      );
    }
  }
);

export const assignSkillPoints = createAsyncThunk(
  'kittens/assignSkillPoints',
  async ({ id, data }: { id: string; data: AssignSkillPointsDto }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.patch<Kitten>(`${API_URL}/kittens/${id}/skills`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'attribution des points de compétence'
      );
    }
  }
);

// Définir le slice
const kittenSlice = createSlice({
  name: 'kittens',
  initialState,
  reducers: {
    clearCurrentKitten: (state) => {
      state.currentKitten = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Gestion de fetchKittens
    builder
      .addCase(fetchKittens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKittens.fulfilled, (state, action: PayloadAction<Kitten[]>) => {
        state.loading = false;
        state.kittens = action.payload;
      })
      .addCase(fetchKittens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de fetchKittenById
    builder
      .addCase(fetchKittenById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKittenById.fulfilled, (state, action: PayloadAction<Kitten>) => {
        state.loading = false;
        state.currentKitten = action.payload;
      })
      .addCase(fetchKittenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de createKitten
    builder
      .addCase(createKitten.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKitten.fulfilled, (state, action: PayloadAction<Kitten>) => {
        state.loading = false;
        state.kittens.push(action.payload);
        state.currentKitten = action.payload;
      })
      .addCase(createKitten.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de updateKitten
    builder
      .addCase(updateKitten.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKitten.fulfilled, (state, action: PayloadAction<Kitten>) => {
        state.loading = false;
        const index = state.kittens.findIndex(kitten => kitten.id === action.payload.id);
        if (index !== -1) {
          state.kittens[index] = action.payload;
        }
        if (state.currentKitten?.id === action.payload.id) {
          state.currentKitten = action.payload;
        }
      })
      .addCase(updateKitten.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de assignSkillPoints
    builder
      .addCase(assignSkillPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignSkillPoints.fulfilled, (state, action: PayloadAction<Kitten>) => {
        state.loading = false;
        const index = state.kittens.findIndex(kitten => kitten.id === action.payload.id);
        if (index !== -1) {
          state.kittens[index] = action.payload;
        }
        if (state.currentKitten?.id === action.payload.id) {
          state.currentKitten = action.payload;
        }
      })
      .addCase(assignSkillPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentKitten, clearError } = kittenSlice.actions;

export default kittenSlice.reducer;
