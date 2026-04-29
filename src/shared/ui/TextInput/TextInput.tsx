import { InputHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './TextInput.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { className, ...otherProps },
    ref
) {
    return <input ref={ref} className={classNames(cls.TextInput, {}, [className || ''])} {...otherProps} />;
});
