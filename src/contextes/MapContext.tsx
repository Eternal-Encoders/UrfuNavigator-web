import { createContext, useState } from "react";

interface IMapContext {
    currentFloor: number,
    setCurrentFloor: (floor: number) => void,
}

export const MapContext = createContext<IMapContext>({
    currentFloor: 1,
    setCurrentFloor: () => {},
});
  
export const MapState = ({ children }: {children: React.ReactNode}) => {
    const [currentFloor, setCurrentFloor] = useState(1);

    return (
        <MapContext.Provider value={{ 
            currentFloor, 
            setCurrentFloor,
        }}>
            {children}
        </MapContext.Provider>
    );
}