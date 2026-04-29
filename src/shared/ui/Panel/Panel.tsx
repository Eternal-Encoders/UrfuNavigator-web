import { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './Panel.module.scss';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
    elevated?: boolean;
}

export function Panel({ className, children, elevated = false, ...otherProps }: PanelProps) {
    return (
        <div
            className={classNames(cls.Panel, { [cls.elevated]: elevated }, [className || ''])}
            {...otherProps}
        >
            {children}
        </div>
    );
}
