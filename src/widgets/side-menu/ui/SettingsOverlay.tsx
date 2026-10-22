import { useRef, type CSSProperties } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { useSettingsSwipe } from '../model/useSettingsSwipe';
import { SettingsPanel } from './SettingsPanel';

export function SettingsOverlay() {
    const { t } = useTranslation();
    const isDesktop = useAppSelector(selectScreenSize).innerWidth > PHONE_BREAKPOINT;
    const opener = useRef<HTMLElement | null>(null);
    const { open, panelRef, offset, dragging, onOpenChange } = useSettingsSwipe();
    return <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="settings-backdrop" />
            <Dialog.Content ref={panelRef} aria-describedby={undefined}
                onEscapeKeyDown={event => { if (isDesktop) event.preventDefault(); }}
                onInteractOutside={event => {
                    // View-transition snapshots can retarget a second click to the document root.
                    const target = event.detail.originalEvent.target;
                    if (isDesktop || document.documentElement.classList.contains('theme-transition')
                        || target === document.documentElement || target === document.body) event.preventDefault();
                }}
                onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement | null; }}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                }}
                className={`navigator-panel is-settings is-expanded settings-overlay ${dragging ? 'is-dragging' : ''}`}
                style={{ '--settings-drag': `${offset}px` } as CSSProperties}>
                <div className="navigator-header">
                    <div className="navigator-handle">
                        <Dialog.Close asChild><button type="button" aria-label={t('TogglePanel')}>
                            <img src="/remake/3a06c.svg" width="24" height="4" alt="" />
                        </button></Dialog.Close>
                    </div>
                    <div className="navigator-search-row">
                        <Dialog.Title className="navigator-heading">{t('Settings')}</Dialog.Title>
                        <Dialog.Close asChild><Button variant="secondary" size="icon-lg" aria-label={t('Close')}>
                            <img src="/remake/f17f3.svg" width="20" height="20" alt="" />
                        </Button></Dialog.Close>
                    </div>
                </div>
                <div className="navigator-body"><SettingsPanel /></div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}
