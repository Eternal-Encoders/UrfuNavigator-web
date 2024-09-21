import { selectPrevContent, setContent } from '../../../features/sideBar/sideBarSlice';
import { classNames } from '../../../shared/lib/classNames/classNames';
import { MiniButton } from '../../../shared/ui/MiniButton/MiniButton';
import { XSign } from '../../../shared/ui/XSign/XSign';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import cls from './CloseButton.module.scss';

interface ICloseButtonProps {
  className?: string;
}

export const CloseButton = ({className}: ICloseButtonProps) => {
    const dispatch = useAppDispatch()
    const prevContent = useAppSelector(selectPrevContent)
    
    function onClickHandler() {
        dispatch(setContent(prevContent));
    }

    return (
        <button onClick={onClickHandler}>
            <MiniButton className={classNames(cls.CloseButton, {}, [className || ''])}>
                <XSign/>
            </MiniButton>
        </button>
    );
};