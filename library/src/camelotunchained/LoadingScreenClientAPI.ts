import { LoadingScreenFunctions, impl as lsf } from '../_baseGame/clientFunctions/LoadingScreenFunctions';

type LoadingScreenClientAPI = LoadingScreenFunctions & {};

// exposure of implementation
export const clientAPI: LoadingScreenClientAPI = {
  bindLoadingScreenListener: lsf.bindLoadingScreenListener.bind(lsf),
  clearManualLoadingScreen: lsf.clearManualLoadingScreen.bind(lsf),
  setLoadingScreenManually: lsf.setLoadingScreenManually.bind(lsf)
};
