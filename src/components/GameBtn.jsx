import React, {forwardRef} from "react"; // usamos forwardRef para permitir que el padre pase una ref al botón

const GameBtn = forwardRef(({color, border, bg, onClick}, ref) => (
      <button
            color={color}
            className={`game-button ${border} ${bg}`} // Usa la clase global 'game-button'
            onClick={onClick}
            ref={ref}
      />
))

export default GameBtn;