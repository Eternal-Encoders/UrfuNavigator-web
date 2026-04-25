import { Line } from 'react-konva';

interface PathProps {
    points: number[]
}

function Path({points}: PathProps) {
    return (
        <Line points={points} stroke="#54B235" strokeWidth={15} />
    )
}

export default Path;