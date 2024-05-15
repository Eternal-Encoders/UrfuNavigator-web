import { createContext } from "react";

interface ICanvasContext {
    width: number,
    height: number,
    zoom: number,
    offset: {x: number, y: number},
    setWidth: (e: number) => void,
    setHeight: (e: number) => void,
    setZoom: (e: number) => void,
    setOffset: (e: {x: number, y: number}) => void
}

export const CanvasContext = createContext<ICanvasContext>({
    width: 300,
    height: 300,
    zoom: 1,
    offset: {x: 0, y: 0},
    setWidth: () => {},
    setHeight: () => {},
    setZoom: () => {},
    setOffset: () => {}
});
  
/*export const CanvasState = ({ children }: {children: React.ReactNode}) => {
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(300);
    const [zoom, setZoom] = useState(1);

    return (
        <CanvasContext.Provider value={{ 
            width, 
            height,
            zoom,
            setWidth,
            setHeight,
            setZoom
        }}>
            {children}
        </CanvasContext.Provider>
    );
}*/