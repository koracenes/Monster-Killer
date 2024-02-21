const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG ATTACK"; //MODE_STRONG_ATTACK = 1

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_MONSTER_STRONG_ATTACK = "MONSTER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum life for you and the monster.", "100");

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonuseLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEnetry;
  // switch (ev) {
  //   default:
  //     logEnetry = {};
  //   case LOG_EVENT_PLAYER_ATTACK:
  //     logEnetry.target = "MONSTER";
  //     break;
  //   case LOG_EVENT_PLAYER_STRONG_ATTACK:
  //     logEnetry = {
  //       event: ev,
  //       value: val,
  //       target: "MONSTER",
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  //     break;
  //   case LOG_EVENT_MONSTER_ATTACK:
  //     logEnetry = {
  //       event: ev,
  //       value: val,
  //       target: "PLAYER",
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  //     break;
  //   case LOG_EVENT_MONSTER_STRONG_ATTACK:
  //     logEnetry = {
  //       event: ev,
  //       value: val,
  //       target: "PLAYER",
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  //     break;
  //   case LOG_EVENT_PLAYER_HEAL:
  //     logEnetry = {
  //       event: ev,
  //       value: val,
  //       target: "PLAYER",
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  //     break;
  //   case LOG_EVENT_GAME_OVER:
  //     logEnetry = {
  //       event: ev,
  //       value: val,
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth,
  //     };
  // }

  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEnetry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEnetry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEnetry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_STRONG_ATTACK) {
    logEnetry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEnetry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEnetry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  }
  battleLog.push(logEnetry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  setPlayerHealth(initialPlayerHealth);
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonuseLife) {
    hasBonuseLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert(`You used bonus life`);
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert(`YOU WON!`);
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert(`YOU LOST!`);
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert(`YOU HAVE DRAW!`);
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}
function attackMonster(mode) {
  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert(`You can't heal more than max health`);
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // FOR LOOPS
  for (let i = 0; i < 3; i++) {
    console.log("-----------");
  }
  //   for (let i = 0; i < battleLog.length; i++) {
  //     console.log(battleLog[i]);
  //   }
  //   console.log(battleLog);
  let i = 0;
  for (const logEntery of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntery) {
      console.log(`${key}=> ${logEntery[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
