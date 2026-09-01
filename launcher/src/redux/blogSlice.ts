import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogType } from './navigationSlice';
import { ListenerHandle } from '../lib/ListenerHandle';

type Callback = (type: BlogType, offset: number) => Promise<ListenerHandle>;

let onLoadRequest: Callback | null = null;

export function setLoadCallback(callback: Callback): ListenerHandle {
  onLoadRequest = callback;
  return {
    close: () => {
      if (onLoadRequest == callback) onLoadRequest = null;
    }
  };
}

export interface Post {
  type: 'news' | 'patch-notes';
  id: number;
  title: string;
  posted: Date;
  content: string;
  imgSrc: string;
}

interface BlogState {
  patchNotes: Record<number, Post>;
  news: Record<number, Post>;
  loading: Record<BlogType, boolean>;
}

const DefaultState = {
  loading: { news: false, 'patch-notes': false },
  patchNotes: {},
  news: {}
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState: DefaultState,
  reducers: {
    onPostsLoaded: (state: BlogState, action: PayloadAction<Post[]>) => {
      for (const article of action.payload) {
        state.loading[article.type] = false;
        switch (article.type) {
          case 'news':
            state.news[article.id] = article;
            break;
          case 'patch-notes':
            state.patchNotes[article.id] = article;
            break;
        }
      }
    },
    onPostLoadFailed: (state: BlogState, action: PayloadAction<BlogType>) => {
      state.loading[action.payload] = false;
    },
    loadNextPage: (state: BlogState, action: PayloadAction<BlogType>) => {
      // TODO : consider async thunk instead of external data source for better call tracking
      if (state.loading[action.payload] || onLoadRequest === null) return;
      state.loading[action.payload] = true;
      switch (action.payload) {
        case 'news':
          onLoadRequest(action.payload, Object.values(state.news).length);
          break;
        case 'patch-notes':
          onLoadRequest(action.payload, Object.values(state.news).length);
          break;
      }
    }
  }
});

export const { onPostsLoaded, onPostLoadFailed, loadNextPage } = blogSlice.actions;
