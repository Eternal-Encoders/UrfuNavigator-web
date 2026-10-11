import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { InstitutePage } from '@/pages/institute';

export function AppRouter() {
    const { t } = useTranslation();

    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="flex size-full items-center justify-center p-10 text-muted-foreground">
                        {t('Loading')}
                    </div>
                }
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/institute/:intstName" element={<InstitutePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
