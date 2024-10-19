import { classNames } from '../../lib/classNames/classNames';
import cls from './XSign.module.scss';

interface IXSignProps {
  className?: string;
}

export const XSign = ({ className }: IXSignProps) => {
    return (
        <div className={classNames(cls.XSign, {}, [className || ''])}>
      ✕
        </div>
    );
};
