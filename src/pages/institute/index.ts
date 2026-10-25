import { lazy } from 'react';

export const preloadInstitutePage = () => import('./ui/InstitutePage');
export const InstitutePage = lazy(preloadInstitutePage);
