import React, {useState, useRef, useEffect} from "react";
import GameBtn from './GameBtn';

const colors = ["green", "red", "yellow", "blue"]; 

function SimonGame(){
   {/*STATES*/}
   const [sequence, setSequence] = useState([]);
   const [playing, setPlaying] = useState(false);
   const [playingIdx, setPlayingIdx] = useState(0);
   const [gameOver, setGameOver] = useState(false);
   const [difficulty, setDifficulty] = useState("easy"); // Estado para la dificultad
   const [speed, setSpeed] = useState(500);
   const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para el mensaje de error


   {/*REFS*/}
   const greenRef = useRef(null);
   const redRef = useRef(null);
   const yellowRef = useRef(null);
   const blueRef = useRef(null);


   {/*FUNCTIONS*/}
   const ResetGame = () => { // funcion para recetear los estados una vez que se pierde el juego 
      setSequence([]);
      setPlaying(false);
      setPlayingIdx(0);
      setGameOver(false);
      setErrorMessage(""); // Limpiar mensaje de error al reiniciar el juego
   }

   const AddNewColor = () => { // funcion para continuar la secuencia de colores y agregar uno nuevo de manera aleatoria
      const color = colors[Math.floor(Math.random() * 4)]
      const NewSequence = [...sequence, color]
      setSequence(NewSequence); 
   }

   const HandleNextLevel = () => { // funcion en caso de iniciar el juego
      if (!playing && !gameOver){ // no permitir jugar si se ha perdido, hasta que se reinicie
         setPlaying(true); // para que no pueda seleccionar de forma consecutiva el boton de play
         AddNewColor(); // se agrega un nuevo color
      }
   }

   const HandleColorClick = (e) => {
      if (playing && !gameOver){ // evitar clicks en los botones si el juego ya finalizo
         e.target.classList.add("opacity-reduced"); // le damos efecto de opacidad al boton

         setTimeout(() => {
            e.target.classList.remove("opacity-reduced"); // le sacamos el efecto
            const ClickColor = e.target.getAttribute("color"); 

            if (sequence[playingIdx] === ClickColor){ // si preciona el color correcto 
               if (playingIdx === sequence.length - 1){ 
                  setTimeout(() => {
                     setPlayingIdx(0);
                     AddNewColor();
                  }, 100);
               }
               else{ // buscar mas colores para continuar con la secuencia de colores
                  setPlayingIdx(playingIdx + 1);
               }
            }
            else{ // si preciona el incorrecto 
               setGameOver(true)
               setErrorMessage("Has perdido, intenta otra vez"); // Establecer el mensaje de error
            }
         }, 100)
      }
   }

   const HandleDifficultyChange = (level) => {
      if (!playing && !gameOver) { // permitir cambiar la dificultad solo si el juego no está en progreso
         setDifficulty(level);
         switch (level) {
            case "easy":
               setSpeed(500); // velocidad facil
               break;
            case "medium":
               setSpeed(350); // velocidad media
               break;
            case "hard":
               setSpeed(150); // velocidad dificil
               break;
            default:
               setSpeed(500);
         }
      }
   }

   {/*USE EFFECT*/}
   useEffect(() => {

      if (sequence.length > 0) {
         const ShowSequence = (idx = 0) => {   // Verificamos cuál es el color actual de la secuencia en la posición 'idx'
            let ref = null;                      // y asignamos la referencia correspondiente del botón al ref
            if (sequence[idx] === "green") ref = greenRef
            if (sequence[idx] === "red") ref = redRef
            if (sequence[idx] === "yellow") ref = yellowRef
            if (sequence[idx] === "blue") ref = blueRef;
            
            setTimeout(() => {     // Esperamos 250ms antes de añadir la clase de brillo al botón seleccionado
               ref.current.classList.add("brightness-enhanced")

               setTimeout(() => { // Esperamos 250ms antes de quitarle la clase de brillo al botón seleccionado
                  ref.current.classList.remove("brightness-enhanced")
                  if (idx < sequence.length - 1) ShowSequence(idx + 1); 
               }, speed);
            }, speed);
         };
         ShowSequence();
      };
   }, [sequence, speed]) // si la secuencia cambia ejecutamos el use effect

   return(
      <section className="game-development">
         {/*HEADER*/}
         <div className="game-header">
            <h1>Simon-Says Game</h1>
            <div className="creator"><a href="https://github.com/LucasPisto">Hecho por: Pistoleso, Lucas Emanuel</a></div>
         </div>

         {/*WRAPPER*/}
         <div className="game-wrapper">
            {/*DIFFICULTY BUTTONS*/}
            <div className="difficulty-buttons">
               <button
                  className={`difficulty-btn ${difficulty === "easy" ? "active" : ""} ${playing || gameOver ? "disabled" : ""}`} // Añade la clase active al botón si la dificultad actual es "easy"
                  // Añade disabled al botón si el juego está en progreso o si el juego ha terminado. Esto desactiva el botón para evitar cambios de dificultad mientras el juego está en curso.
                  onClick={() => HandleDifficultyChange("easy")}
                  disabled={playing || gameOver} // disabled se aplica al botón si playing o gameOver son true, deshabilitando la interacción con el botón.
               >
                  Fácil
               </button>
               <button
                  className={`difficulty-btn ${difficulty === "medium" ? "active" : ""} ${playing || gameOver ? "disabled" : ""}`}
                  onClick={() => HandleDifficultyChange("medium")}
                  disabled={playing || gameOver}
               >
                  Medio
               </button>
               <button
                  className={`difficulty-btn ${difficulty === "hard" ? "active" : ""} ${playing || gameOver ? "disabled" : ""}`}
                  onClick={() => HandleDifficultyChange("hard")}
                  disabled={playing || gameOver}
               >
                  Difícil
               </button>
            </div>
            {/*GAME CONTAINER*/}
            <div className="game-container">
               {/*GREEN AND RED CONTAINER*/}
               <div className="button-row">
                  {/*GREEN BUTTON*/}
                  <GameBtn
                  color="green"
                  border="green-border"
                  bg="green-btn"
                  onClick={HandleColorClick}
                  ref={greenRef}
                  />
                  {/*RED BUTTON*/}
                  <GameBtn
                  color="red"
                  border="red-border"
                  bg="red-btn"
                  onClick={HandleColorClick}
                  ref={redRef}
                  />
               </div>

               {/*YELLOW AND BLUE CONTAINER*/}
               <div className="button-row">
                  {/*YELLOW BUTTON*/}
                  <GameBtn
                  color="yellow"
                  border="yellow-border"
                  bg="yellow-btn"
                  onClick={HandleColorClick}
                  ref={yellowRef}
                  />

                  {/*BLUE BUTTON*/}
                  <GameBtn
                  color="blue"
                  border="blue-border"
                  bg="blue-btn"
                  onClick={HandleColorClick}
                  ref={blueRef}
                  />
               </div>

               {/* RESET BUTTON */}
               {gameOver ? (  // si el juego a terminado mostrar el boton reiniciar
                  <section className="error-container">
                     <div className="error-message">
                        {errorMessage}
                     </div> {/* Mostrar el mensaje de error */}
                     <button className="reset-button" onClick={ResetGame}>
                        Reiniciar
                     </button>
                  </section>
               ) : ( // sino el boton de incio
               // PLAY BUTTON
                  <button className="play-button" onClick={HandleNextLevel}>
                     {sequence.length === 0 ? "Play" : sequence.length} {/*al comenzar el juego automaticamente comenzara el conteo y desaprecera la palabra "play"*/}
                  </button>
               )}
            </div> 
         </div>
      </section>
   );
}

export default SimonGame;