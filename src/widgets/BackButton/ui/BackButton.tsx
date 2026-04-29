import { useNavigate } from 'react-router-dom';
import { selectSearchPoints, setPoints } from '../../../features/pointsSearch/pointsSearchSlice';
import { classNames } from '../../../shared/lib/classNames/classNames';
import { IconButton } from '../../../shared/ui/IconButton/IconButton';
import { XSign } from '../../../shared/ui/XSign/XSign';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import cls from './BackButton.module.scss';

interface IBackButtonProps {
  className?: string;
}

export const BackButton = ({ className }: IBackButtonProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const points = useAppSelector(selectSearchPoints)

    function onClickHandler() {
        if (points.from || points.to) {
            dispatch(setPoints({
                from: undefined,
                to: undefined
            }))
        } else {
            navigate('/');
        }
    }

    return (
        <IconButton
            onClick={onClickHandler}
            label="Back"
            className={classNames(cls.BackButton, {}, [className || ''])}
        >
            <XSign />
        </IconButton>
    );
};