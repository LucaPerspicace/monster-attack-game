const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK ='ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK= 'PLAYER_ATTACK';
const LOG_EVENT_STRONG_ATTACK = 'PLAYER_S_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let battleLog = [];


function getMaxLifeValues(){
    const ENTERED_VALUE = prompt('scegli la vita','100');
    const parsedValue = parseInt(ENTERED_VALUE);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw {message:'Input non valido'};
}
    return parsedValue;
}
let chosenMaxLife;
try{
    chosenMaxLife = getMaxLifeValues();
} catch (error){
    console.log(error);
    chosenMaxLife = 100;
    alert('Hai inserito un valore non valido, la vita sarà impostata a 100.');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

function writeToLog(ev,val,monsterHealth,playerHealth){
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    if (ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';
    } else if ( ev === LOG_EVENT_STRONG_ATTACK) {
        logEntry.target = 'MONSTER';

} else if (ev === LOG_EVENT_MONSTER_ATTACK){
    logEntry.target = 'PLAYER';

} else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = 'PLAYER';

} else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    }
    battleLog.push(logEntry);

}



adjustHealthBars(chosenMaxLife);
function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE: STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_STRONG_ATTACK;
    // if (mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
     currentMonsterHealth -= damage;
     writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
       );
     endRound();
} 

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(STRONG_ATTACK_VALUE);
}

function healPlayerHandler(){
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('YOU CANT');
        healValue =chosenMaxLife - currentPlayerHealth;
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

function endRound(){
    const initialPlayerLife = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerLife;
        alert('COME BACK SOLDIER!');
        setPlayerHealth(initialPlayerLife);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
       alert('YOU WON!');
       writeToLog(
        LOG_EVENT_GAME_OVER,
        'PLAYER WINS',
        currentMonsterHealth,
        currentPlayerHealth
       );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
       alert('YOU LOST!');
       writeToLog(
        LOG_EVENT_GAME_OVER,
        'MONSTER WINS',
        currentMonsterHealth,
        currentPlayerHealth
       );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
       alert('DRAW..');
       writeToLog(
        LOG_EVENT_GAME_OVER,
        'DRAW',
        currentMonsterHealth,
        currentPlayerHealth
       );
    }

    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }

}

function reset() {
currentMonsterHealth = chosenMaxLife;
currentPlayerHealth = chosenMaxLife;
resetGame(chosenMaxLife);
}
function printLogHandler(){
    // for (let i = 0; i < battleLog.length; i++){
    // console.log(battleLog[i]);
    // }
    for (const el of battleLog){
        console.log(el);
    }
}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);