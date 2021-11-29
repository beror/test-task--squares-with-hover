import { useState, useEffect, useRef, useReducer } from 'react';
import { css } from '@emotion/css';

import Grid from './Grid';
import HoverList from './HoverList';

/*
    grid is of form

    false false true  false false
    true  false true  true  false
    false false false false true
    true  true  false false true
    true  false false false false

    where each value represents whether the corresponding square is highlighted or not
*/

const appClassName = css`
    display: flex;
    flex-flow: row nowrap;
`;

const selectModeClassName = css`
    width: 120px;
    height: 30px;
    
    margin-top: 20px;
    margin-right: 10px;

    @media (max-width: 400px) {
        width: 90px;
        height: 25px;

        font-size: 12px;
    }
`;

const startButtonClassName = css`
    width: 60px;
    height: 30px;

    margin-right: 10px;

    background-color: skyBlue;

    border: none;
    border-radius: 3px;

    &:hover {
        filter: brightness(90%);

        cursor: pointer;
    }

    &:active {
        filter: brightness(85%);
    }
`;

const hoverListClassName = css`
    height: 90vh;
    margin-left: 30px;
`;

const App = () => {
    const [ isGameStarted, setIsGameStarted ] = useState(false);
    const [ mode, setMode ] = useState('easy');

    const [ width, setWidth ] = useState(5);
    // width is updated when mode is updated
    useEffect(() => {
        if(optionEasyRef.current?.value && optionNormalRef.current?.value && optionHardRef.current?.value) {
            let newWidth: number;
            switch(mode) {
                case 'easy': newWidth = +optionEasyRef.current.value; break;
                case 'normal': newWidth = +optionNormalRef.current.value; break;
                case 'hard': newWidth = +optionHardRef.current.value; break;
                default: throw Error('LB');
            }
            setWidth(newWidth);
        }
    }, [mode]);

    // forceUpdate is needed for setGrid to work,
    // because when grid.mutableGrid is changed
    // React's shallow state comparsion won't notice
    // the difference and won't trigger a rerender
    const [ , forceUpdate ] = useReducer(x => x + 1, 0);

    const gridActions = {
        SET: 'SET',
        TOGGLESQUARE: 'TOGGLE'
    };

    const gridReducer = (grid: Record<string, boolean[]>, action: { type: string, payload: any }) => {
        switch (action.type) {
            case gridActions.SET:
                return { mutableGrid: action.payload };

            case gridActions.TOGGLESQUARE:
                grid.mutableGrid[action.payload] = !grid.mutableGrid[action.payload];
                forceUpdate();
                return grid;

            default: return grid;
        }
    };

    // grid contains a single property - a mutable representation of itself.
    // This is done to improve performance (so that updating grid takes O(n))
    const [ grid, setGrid ] = useReducer( gridReducer, { mutableGrid: new Array(width*width).fill(false) } );
    // grid (its dimensions) is updated when width is updated
    useEffect( () => setGrid( { type: gridActions.SET, payload: new Array(width*width).fill(false) } ), [width, gridActions.SET] );

    const [ hoveredSquares, setHoveredSquares ] = useState<Array<number>>([]);

    const optionEasyRef = useRef<HTMLOptionElement>(null);
    const optionNormalRef = useRef<HTMLOptionElement>(null);
    const optionHardRef = useRef<HTMLOptionElement>(null);

    const onHighlightToggle = (squareIndex: number) => {
        if(isGameStarted) {
            setHoveredSquares(prevHoveredSquares => {
                const hoveredSquareIndex = prevHoveredSquares.indexOf(squareIndex);

                if(hoveredSquareIndex !== -1) {
                    const newHoveredSquares = [...prevHoveredSquares];
                    newHoveredSquares.splice(hoveredSquareIndex, 1);
                    return [...newHoveredSquares];
                }
                else return [...prevHoveredSquares, squareIndex];
            });

            setGrid( { type: gridActions.TOGGLESQUARE, payload: squareIndex } );
        }
    };

    const onModeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(e.target.selectedOptions[0].id);
        setHoveredSquares([]);
        setIsGameStarted(false);
    };

    const onModeApplied = () => {
        setGrid( { type: gridActions.SET, payload: new Array(width*width).fill(false) } );
        setHoveredSquares([]);
        setIsGameStarted(true);
    };
    
    useEffect(() => {
        fetch('https://demo1030918.mockable.io')
        .then(res => res.json())
        .then(modePreset => {
            optionEasyRef.current!.value = modePreset.easyMode.field;
            optionNormalRef.current!.value = modePreset.normalMode.field;
            optionHardRef.current!.value = modePreset.hardMode.field;
        })
        .catch(console.error);
    }, []);

    return (
        <div className={appClassName}>
            <div>
                <select onChange={onModeSelected} className={selectModeClassName}>
                    <option id='easy' value='' ref={optionEasyRef}>Easy mode</option>
                    <option id='normal' value='' ref={optionNormalRef}>Normal mode</option>
                    <option id='hard' value='' ref={optionHardRef}>Hard mode</option>
                </select>

                <button onClick={onModeApplied} className={startButtonClassName}>Start</button>
            </div>
            <main>
                <Grid width={width} grid={grid.mutableGrid} onHighlightToggle={onHighlightToggle} />
            </main>

            <aside className={hoverListClassName}>
                <HoverList width={width} hoveredSquares={hoveredSquares} />
            </aside>
        </div>
    );
};

export default App;