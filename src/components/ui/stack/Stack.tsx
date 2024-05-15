function Stack() {
    return (
        <>
        </>
    )
}

export default Stack;

/*
constructor(props) {
    super(props);

    this.state = {
        currentIndex: 0
    };

    this.__actions = [];
    this.__makeActions(props.way, props.currentFloor);
}

componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
        this.setState({currentIndex: 0});
        this.__makeActions(this.props.way, this.props.currentFloor);
    }
}

__makeActions(way, floor) {
    if (Number(floor) === way.startFloor) {
        this.__getActions(way.start, way.endFloor);
    } else {
        this.__getActions(way.end);
    }
}

__getActionName(vector) {
    if (vector[0] < 0) {
        return "Поверните направо";
    }
    else if (vector[0] > 0) {
        return "Поверните налево";
    }
    return "Идите вперед"
}

__getActions(points, toFloor=undefined) {
    const result = [this.__getActionName([0, 0])]
    let base = [
        Math.sign(round(points[0].x - points[1].x, 10)), Math.sign(round(points[0].y - points[1].y, 10)),
        Math.sign(round(points[0].y - points[1].y, 10)), -Math.sign(round(points[0].x - points[1].x, 10))
    ];

    for (let i = 1; i < points.length - 1; i++) {
        const dx = round(points[i].x - points[i + 1].x, 10);
        const dy = round(points[i].y - points[i + 1].y, 10);
        const delta = [
            dx * base[1] + dy * base[3],
            dx * base[2] + dy * base[2]
        ]
        const action = this.__getActionName(delta);

        if (result[result.length - 1] !== action) {
            result.push(action);
        }
        base = [
            Math.sign(round(dx, 10)), Math.sign(round(dy, 10)),
            Math.sign(round(dy, 10)), -Math.sign(round(dx, 10))
        ]

    }
    if (toFloor) {
        result.push(`Поднимитесь на ${toFloor} этаж`);
    }

    this.__actions = result;
}

render() {
    console.log(this.__actions);
    return (
        <div>
            <div className='hinit-text-div'>
                <p className='hinit-text'>{ this.__actions[this.state.currentIndex] }</p>
            </div>
            <div className='hinit-buttons'>
                <button className='hinit-back btn-reset' onClick={() => this.setState({currentIndex: clamp(this.state.currentIndex - 1, 0, this.__actions.length - 1)})}>
                    <img className="audience-circle-ins" src={ arrowBackImg } alt='Назад'/>
                </button>
                <button className='hinit-ahead btn-reset' onClick={() => this.setState({currentIndex: clamp(this.state.currentIndex + 1, 0, this.__actions.length - 1)})}>
                    <img className="audience-circle-ins" src={ forwardArrowImg } alt='Вперед'/>
                </button>
            </div>
        </div>
    )
}
*/