class Character {
  constructor(hp, dmg, name) {
    this.hp = hp;
    this.ep = 100;
    this.dmg = dmg;
    this.name = name;
  }

  attack(enemy) {
    enemy.hp -= this.dmg;
  }

  drawCard() {
    const $li = $("<li>")
      .addClass("card")
      .on("click", (event) => {
        event.currentTarget.remove();
        $(".maze-image").remove();
        chosenDirection();
        hero.drawCard();
      })
      .append($randomDirectionCard())
      .appendTo($hand);
  }
}

const mazeImages = [
  "defaultImages/hallwayOne.jpg",
  "defaultImages/hallwayTwo.jpg",
  "defaultImages/hallwayThree.jpg",
  "defaultImages/battleImageOne.jpg",
  "defaultImages/battleImageTwo.jpg",
  "defaultImages/battleImageThree.jpg",
];
const directionCards = [
  "defaultImages/pointUpCard.png", //Forward
  "defaultImages/pointingRightCard.png", //Right
  "defaultImages/pointingLeftCard.png", //Left
];

const currentMazeImage = [];
const enemyInCombat = [];
const enemyGraveyard = [];
let hero = "";
let isClicked = false;

const $hand = $("#hand");
const $mainScreen = $("#main-screen");
const $startScreen = $("#start-screen");
const $gameOverScreen = $("#game-over-screen");
const $startButton = $("#start-button");
const $attackButton = $("#attack-button");
const $runButton = $("#run-button");
const $restartButton = $("#restart-button");
const $combatButtonBox = $("#combat-button-box");

const $bossBattleImage = $("<img>")
  .attr("src", "defaultImages/bossBattleImage.jpeg")
  .addClass("boss-image");

const $gameOverImage = $("<img>")
  .attr("src", "defaultImages/gameOverImage.jpg")
  .addClass("game-over-image");

const $enemyImage = $("<img>")
  .attr("src", "defaultImages/enemy.png")
  .addClass("enemy-image");

const $escapePodImage = $("<img>")
  .attr("src", "defaultImages/escapePod.png")
  .addClass("win-image");

const clearTheGraveyard = (array) => {
  while (array.length > 0) {
    array.pop();
  }
};

const $randomDirectionCard = () =>
  $("<img>").attr(
    "src",
    directionCards[Math.floor(Math.random() * directionCards.length)]
  );

const chosenDirection = () => {
  const mazeImage = mazeImages[Math.floor(Math.random() * mazeImages.length)];
  const $randomMazeImage = $("<img>")
    .attr("src", mazeImage)
    .addClass("maze-image");
  currentMazeImage.unshift(mazeImage);
  $($mainScreen).append($randomMazeImage);
  if (currentMazeImage.length === 2) {
    currentMazeImage.pop();
  }

  if (
    currentMazeImage[0] === mazeImages[3] ||
    currentMazeImage[0] === mazeImages[4] ||
    currentMazeImage[0] === mazeImages[5]
  ) {
    $enemyImage.appendTo($mainScreen);
    $enemyImage.show();
    generateEnemy();
    combat();
  } else {
    $combatButtonBox.hide();
    $attackButton.hide();
    $runButton.hide();
    $enemyImage.hide();
  }

  if (enemyGraveyard.length === 4) {
    $(".maze-image").remove();
    $enemyImage.hide();
    $mainScreen.append($bossBattleImage);
    $bossBattleImage.show();
    $combatButtonBox.show();
    $attackButton.show();
    $runButton.show();
    generateBoss();
    combat();
  }

  if (enemyGraveyard.length > 4) {
    $bossBattleImage.hide();
    $(".maze-image").remove();
    $hand.hide();
    $attackButton.hide();
    $runButton.hide();
    $combatButtonBox.hide();
    $enemyImage.hide();
    $escapePodImage.appendTo($mainScreen);
    $("<h1>").text("YOU WIN!").addClass("win-announce").appendTo($mainScreen);
    $(".win-announce").show();
    $escapePodImage.show();
    clearTheGraveyard(enemyGraveyard);
    console.log(enemyGraveyard);
  }
};

const createHand = () => {
  $hand.show();
  for (cards of directionCards) {
    const $li = $("<li>")
      .addClass("card")
      .on("click", (event) => {
        event.currentTarget.remove();
        $(".maze-image").remove();
        chosenDirection();
        hero.drawCard();
      })
      .append($randomDirectionCard())
      .appendTo($hand);
  }
};

const generateEnemy = () => {
  const enemy = new Character(15, Math.floor(Math.random() * 6) + 1, "enemy");
  enemyInCombat.unshift(enemy);
};

const generateBoss = () => {
  const boss = new Character(Math.floor(Math.random() * 40) + 25, 10, "boss");
  enemyInCombat.unshift(boss);
};

const generateHero = () => {
  hero = new Character(95, 10, "Cody");
};
// Its In Here <---------- !!!!!!
const combat = () => {
  $combatButtonBox.show();
  $attackButton.show();
  $runButton.show();
  $hand.hide();
  $(".attacked")
    .text("Your Being Attacked!")
    .addClass("attack-announce")
    .appendTo($combatButtonBox);
  //This part <--------------
  if (isClicked === true) {
    enemyInCombat[0].attack(hero);
    $enemyImage.animate({ left: "+=1em" }, "fast");
    $enemyImage.animate({ left: "-=1em" }, "fast");
    isClicked = false;
  }
  if (hero.hp <= 0) {
    $("<h1>").text("You Died!").addClass("died").appendTo($gameOverScreen);
    $combatButtonBox.hide();
    $attackButton.hide();
    $runButton.hide();
    $(".maze-image").hide();
    $enemyImage.hide();
    $bossBattleImage.hide();
    $hand.children().remove();
    $restartButton.show();
    $gameOverImage.appendTo($gameOverScreen);
    $gameOverScreen.show();
    clearTheGraveyard(enemyGraveyard);
  }

  if (enemyInCombat[0].hp <= 0) {
    for (index of enemyInCombat) {
      enemyGraveyard.push(index);
    }
    $enemyImage.hide();
    enemyInCombat.pop();
    $combatButtonBox.hide();
    $attackButton.hide();
    $runButton.hide();
    $hand.show();
  }
};

$startButton.on("click", () => {
  $startScreen.hide();
  $mainScreen.show();
  $restartButton.show();
  generateHero();
  createHand();
  chosenDirection();
});

$attackButton.on("click", () => {
  hero.attack(enemyInCombat[0]);
  isClicked = true;
  combat();
});

$runButton.on("click", () => {
  if (hero.ep > 0) {
    hero.ep -= 25;
    $(".maze-image").remove();
    $hand.show();
    chosenDirection();
  } else {
    $("<h1>")
      .text("Your out of energy! You must fight!")
      .addClass("energy-announce")
      .appendTo($combatButtonBox);
    $(".attack-announce").hide();
    $runButton.hide();
  }
});

// THIS!!!!!!!!!!!! <-----------
$restartButton.on("click", () => {
  $gameOverScreen.hide();
  $(".maze-image").remove();
  $combatButtonBox.hide();
  $attackButton.hide();
  $runButton.hide();
  $hand.children().remove();
  $enemyImage.hide();
  $startScreen.show();
  $restartButton.hide();
  $(".win-announce").hide();
  $escapePodImage.hide();
  $(".died").remove();
  $bossBattleImage.hide();
  $(".win-announce").remove();
  $(".energy-announce").remove();
  clearTheGraveyard(enemyGraveyard);
  clearTheGraveyard(enemyInCombat);
  console.log(enemyGraveyard);
});

$(() => {
  $combatButtonBox.hide();
  $attackButton.hide();
  $runButton.hide();
  $enemyImage.hide();
  $restartButton.hide();
});
