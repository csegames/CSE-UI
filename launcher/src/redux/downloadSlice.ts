import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatcherStatus } from '../api/patcher/patcherStatus';
import { DownloadInfo } from '../api/patcher/downloadInfo';
import { FailureType } from '../api/patcher/failureType';

type DownloadState = DownloadInfo;

const DefaultState: DownloadState = {
  status: PatcherStatus.Initializing,
  totalFiles: 0,
  completedFiles: 0,
  rate: 0,
  estimate: 0,
  remaining: 0,
  failureType: FailureType.None,
  channelID: null,
  started: null
};

export const downloadSlice = createSlice({
  name: 'download',
  initialState: DefaultState,
  reducers: {
    updateDownload: (state: DownloadState, action: PayloadAction<DownloadInfo>) => {
      return action.payload;
    }
  }
});

export const { updateDownload } = downloadSlice.actions;
