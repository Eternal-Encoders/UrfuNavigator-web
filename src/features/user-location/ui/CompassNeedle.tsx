import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

export function CompassNeedle({ needleRef, ready }: { needleRef: RefObject<SVGSVGElement | null>, ready: boolean }) {
    const { t } = useTranslation();
    return <span role="img" aria-label={t('PhoneDirection')} title={t('PhoneDirection')}
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 grid size-10 place-items-center [visibility:var(--floor-map-compass-visibility,hidden)]"
        style={{ display: ready ? undefined : 'none' }}>
        <svg ref={needleRef} width="30" height="36" viewBox="0 0 30 40" aria-hidden="true"
            style={{ transform: 'rotate(calc(var(--phone-compass-heading, 0deg) + var(--floor-map-rotation, 0deg) + var(--floor-map-north, 0deg)))' }}>
            <path d="M15 1 5 23 15 19Z" fill="#F43E44" />
            <path d="M15 1 25 23 15 19Z" fill="#C92C37" />
            <path d="M15 39 5 23 15 19Z" fill="#D9DCE3" />
            <path d="M15 39 25 23 15 19Z" fill="#9296A2" />
        </svg>
    </span>;
}
