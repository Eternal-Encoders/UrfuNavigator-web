import { useDispatch, useSelector, useStore } from 'react-redux';

// RootState / AppDispatch / AppStore are declared globally by `@/app/store`,
// so `shared` never imports from the `app` layer.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
