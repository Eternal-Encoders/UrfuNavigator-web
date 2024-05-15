import React from "react";
import { Text } from "react-konva";

interface AudienceTextProps {
    x: number,
    y: number,
    text: string,
    alignX: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED" | undefined,
    alignY: "CENTER" | "TOP" | "BOTTOM" | undefined
}

function AudienceText({text, x, y, alignX, alignY}: AudienceTextProps) {
    return (
        <Text 
            text={text} 
            x={x} y={y} 
            fontStyle="500" 
            fontFamily="Roboto" 
            fontSize={24} 
            fill="#3A3A3A" 
            align={alignX?.toLowerCase()}
            verticalAlign={alignY?.toLowerCase()}
        />
    )
}

export default React.memo(AudienceText);