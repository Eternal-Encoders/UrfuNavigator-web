/* eslint-disable no-unused-vars */
import { ButtonHTMLAttributes, FC } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './Button.module.css';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: FC<IButtonProps> = (props) => {
    const {
        className, children, ...otherProps
    } = props;
    return (
        <button
            type="button"
            {...otherProps}
            className={classNames(cls.Button, {}, [cls[className || '']])}
        >
            {children}
        </button>
    );
};
