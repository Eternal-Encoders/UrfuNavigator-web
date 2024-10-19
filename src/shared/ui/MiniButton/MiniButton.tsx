import { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './MiniButton.module.scss';

export enum EThemeMiniButton {
    PAINTED = 'painted',
    CLEAR = 'clear',
}

interface IMiniButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: EThemeMiniButton;
}

export const MiniButton = (props: IMiniButtonProps) => {
    const {
        className, children, theme
    } = props;

    return (
        <div className={classNames(cls.MiniButton, {}, [className || '', cls[theme || '']])}>
            {children}
        </div>
    );
};
