import { useEffect } from 'react';
import {
  LOCAL_STORAGE,
  PAGE_URL_SEARCH_PARAM_KEY,
  PageState,
  type PageStateType,
} from '@/constants/app';
import { useAppDispatch } from '@/stores/hooks';
import { canvasActions } from '@/stores/slices/canvas';
import { storage } from '@/utils/storage';
import MainContainer from './components/MainContainer/MainContainer';
import useWindowSize from './hooks/useWindowSize/useWindowSize';
import { urlSearchParam } from './utils/url';

const App = () => {
  const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);

  const dispatch = useAppDispatch();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (pageId) {
      return;
    }

    const stateFromStorage = storage.get<PageStateType>(LOCAL_STORAGE.KEY);

    if (stateFromStorage) {
      try {
        PageState.parse(stateFromStorage);
      } catch (error) {
        return;
      }

      dispatch(canvasActions.set(stateFromStorage.page));
    }
  }, [pageId, dispatch]);

  return <MainContainer pageId={pageId} viewportSize={windowSize} />;
};

export default App;
