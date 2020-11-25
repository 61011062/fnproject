/////// LOAD IMAGES ////////

// LOAD BG IMAGE
const BG_IMG = new Image();
BG_IMG.src = rootContext +"img/bg2.jpg";

const SPEED_IMG = new Image();
SPEED_IMG.src = rootContext +"img/speed.png";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = rootContext +"img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = rootContext +"img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = rootContext +"img/score.png";


/////// END LOAD IMAGES ////////

// ************************ //

/////// LOAD SOUNDS ////////

const WALL_HIT = new Audio();
WALL_HIT.src = rootContext +"sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = rootContext +"sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = rootContext +"sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = rootContext +"sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = rootContext +"sounds/brick_hit.mp3";


/////// END LOAD SOUNDS ////////
