import { useOpenSearchHook } from '../../shared/hooks/OpenSearchHook';

import style from './OpenSearchBtn.module.scss';

interface OpenSearchBtnProps {
    isEnd: boolean,
    isHomePage?: boolean,
    setIsEnd: (_isEnd: boolean) => void
}

function OpenSearchBtn({ isEnd, isHomePage, setIsEnd }: OpenSearchBtnProps) {
    const {
        color,
        text,
        currentPoint,
        onClickHandler
    } = useOpenSearchHook(isEnd, isHomePage, setIsEnd);

    return (
        <>
            <button
                className={isHomePage ? 
                    `${style['home-open-search-btn']} ${style['open-search-btn']}` : 
                    style['open-search-btn']
                }
                onClick={ onClickHandler }
            >
                <div className={style['open-search-btn-container']}>
                    {isHomePage ? 
                        null : 
                        <div className={style['open-search-btn-circle']} style={{ backgroundColor: color }}/> 
                    }
                    {currentPoint ? 
                        <span className={`${style['open-search-btn-name']} ${style['not-like-placeholder']}`}>
                            { currentPoint.names.join(', ') }
                        </span> : 
                        <span className={`${style['open-search-btn-name']} ${style['like-placeholder']}`}>
                            { text }
                        </span> 
                    }
                </div>
            </button>
        </>
    )
}

export default OpenSearchBtn;