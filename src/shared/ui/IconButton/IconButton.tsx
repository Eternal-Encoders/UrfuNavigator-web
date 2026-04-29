import { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './IconButton.module.scss';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: ReactNode;
    label: string;
    variant?: 'painted' | 'clear';
}

export function IconButton({
    className,
    children,
    label,
    variant = 'painted',
    ...otherProps
}: IconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className={classNames(cls.IconButton, {}, [cls[variant], className || ''])}
            {...otherProps}
        >
            {children}
        </button>
    );
}
