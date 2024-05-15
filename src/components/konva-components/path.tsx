import {Line} from "react-konva";

interface PathProps {
    points: number[]
}

function Path({points}: PathProps) {
    return (
        <Line points={points} stroke="#329F5B" strokeWidth={15} />
    )
}

export default Path;