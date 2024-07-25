import React, { useEffect, useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import nullSvg from "./img/null.svg";

interface AudienceIconProps {
    imgName: string,
    x: number,
    y: number
}

function AudienceIcon({imgName, x, y}: AudienceIconProps) {
    const [path, setPath] = useState(nullSvg);
    useEffect(() => {
        (async () => {
            const img = await import(`./img/${imgName}.svg`);
            setPath(img.default);
        })();
    }, [imgName, setPath]);
    const [image] = useImage(path);
    return (
        <Image image={image} x={x} y={y} />
    )
}

export default React.memo(AudienceIcon);