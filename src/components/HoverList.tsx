import { css } from '@emotion/css';

const listHeaderClassName = css`
    margin-bottom: 10px;

    font-size: 20px;
    font-weight: bolder;

    border-bottom: 1px solid lightgrey;
`;

const listClassName = css`
    display: flex;

    height: inherit;

    flex-flow: column wrap;
    row-gap: 4px;
    column-gap: 10px;
`;

const itemClassName = css`
    display: flex;

    width: 120px;
    height: 30px;

    font-size: 12px;
    font-family: monospace;

    color: #8c6d3f;
    background-color: #fcf8e3;
    
    border-radius: 5px;

    justify-content: center;
    align-items: center;
`;

interface HoverListProps {
    width: number;
    hoveredSquares: number[];
};

const HoverList = ({ width, hoveredSquares }: HoverListProps) => {
    /**
     * @example
     * width = 5
     * getRowAndColumn(14) returns [3, 4]
     * @param index The index of the square in grid
     * @returns A 2-element array where the 1st element is the row and the 2nd element is the column. The row and the column count from 1, not 0
     */
    const getRowAndColumn = (index: number) => {
        const row = Math.trunc(index / width) + 1;
        const column = index % width + 1;

        return [row, column];
    };

    return (
        <>
            <div className={listHeaderClassName}>Hovered squares</div>
            <div className={listClassName}>
                { hoveredSquares.map((item, index) => <div className={itemClassName} key={index}>Row: { getRowAndColumn(item)[0] }, Col: { getRowAndColumn(item)[1] } </div>) }
            </div>
        </>
    );
};

export default HoverList;