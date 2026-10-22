import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/shared/ui';

export function BuildingPhotoImage({ src, alt, eager }: { src: string, alt: string, eager: boolean }) {
    const image = useRef<HTMLImageElement>(null);
    const [visible, setVisible] = useState(eager);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (visible || !image.current) return;
        if (!('IntersectionObserver' in window)) { setVisible(true); return; }
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
        });
        observer.observe(image.current);
        return () => observer.disconnect();
    }, [visible]);
    return <>
        {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
        <img ref={image} src={visible ? src : undefined} alt={alt} width="100" height="100" decoding="async"
            onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
    </>;
}
