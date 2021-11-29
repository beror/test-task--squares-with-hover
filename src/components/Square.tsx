import { css } from '@emotion/css';

const squareClassName = css`
    width: 35px;
    height: 35px;
    border: 2px solid black;

    @media (max-width: 900px) {
        width: 25px;
        height: 25px;
    }

    @media (max-width: 700px) {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 550px) {
        width: 10px;
        height: 10px;
    }
`;

interface SquareProps {
    isHighlighted: boolean;
    onHighlightToggle: React.MouseEventHandler<HTMLDivElement>;
};

const Square = ({ isHighlighted, onHighlightToggle }: SquareProps) => {
    return (
        <div
            style={{backgroundColor: isHighlighted ? 'blue' : 'white'}} 
            className={squareClassName}
            onMouseEnter={onHighlightToggle}
        />
    );
};

export default Square;