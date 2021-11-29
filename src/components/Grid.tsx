import Square from './Square';
import { css } from '@emotion/css';

const gridClassName = css`
    display: grid;
    row-gap: 1px;
    column-gap: 1px;
`;

interface GridProps {
    width: number;
    grid: Array<boolean>;
    onHighlightToggle: (index: number) => void;
};

const Grid = ({ width, grid, onHighlightToggle }: GridProps) => {
    return (
        <div
            style={{
                gridTemplateRows: `repeat(${width}, ${100 / width}%`,
                gridTemplateColumns: `repeat(${width}, ${100 / width}%)`
            }}

            className={gridClassName}
        >
            {
                grid.map((square, index) =>
                    <Square
                        key={index}
                        isHighlighted={square}
                        onHighlightToggle={()=>{onHighlightToggle(index)}}
                    />)
            }
        </div>
    );
};

export default Grid;