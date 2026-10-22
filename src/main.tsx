import { createRoot } from 'react-dom/client';
import { App, AppLoading, prepareApp } from '@/app';

const root = createRoot(document.getElementById('root')!);
root.render(<AppLoading />);
const start = () => root.render(<App />);
// Resolve the initial locale before mounting the app-wide Suspense boundary.
void prepareApp.then(start, start);
