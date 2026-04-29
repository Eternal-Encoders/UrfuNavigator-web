 
import { ButtonHTMLAttributes, FC } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './Button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: FC<IButtonProps> = (props) => {
    const {
        className,
        children,
        variant = 'secondary',
        size = 'md',
        fullWidth = false,
        ...otherProps
    } = props;

    return (
        <button
            type="button"
            {...otherProps}
            className={classNames(
                cls.Button,
                { [cls.fullWidth]: fullWidth },
                [cls[variant], cls[size], className || '']
            )}
        >
            {children}
        </button>
    );
};
