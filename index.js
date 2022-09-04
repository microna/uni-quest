const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
canvas.width = 1024
canvas.height = 576
console.log(gsap)



const collisionsMap = []
for(let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i , 70 + i ))
}

const battleZonessMap = []
for(let i = 0; i < battleZonesData.length; i += 70){
    battleZonessMap.push(battleZonesData.slice(i , 70 + i ))
}

console.log(battleZonessMap)



const boundaries = []
const offset = {
    x: -470,
    y: -700
}
collisionsMap.forEach((row , i)=> {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
        boundaries.push(
            new Boundary({
            position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
            }
        }))
    })
})

const battleZones = []

battleZonessMap.forEach((row , i)=> {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
        battleZones.push(
            new Boundary({
            position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
            }
        }))
    })
})



console.log(battleZonessMap)


const image = new Image()
image.src = './images/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './images/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './images/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './images/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './images/playerRight.png'



// canvas.width / 2 - this.image.width / 4, 
// canvas.height / 2 - this.image.height / 2,

const player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
      max: 4,
      hold: 10
    },
    sprites: {
      up: playerUpImage,
      left: playerLeftImage,
      right: playerRightImage,
      down: playerDownImage
    }
  })

console.log(player)


const background = new Sprite({
    position: {
    x: offset.x,
    y: offset.y
},
image: image
})

const foreground = new Sprite({
    position: {
    x: offset.x,
    y: offset.y
},
image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    } 
}



const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectengel1, rectengel2}){
    return(
        rectengel1.position.x + rectengel1.width >= rectengel2.position.x &&
        rectengel1.position.x <= rectengel2.position.x + rectengel2.width &&
        rectengel1.position.y <= rectengel2.position.y + rectengel2.height &&
        rectengel1.position.y + rectengel1.height >= rectengel2.position.y
    )
}

const battle = {
    initiated: false
}

function animate(){
const animationId =  window.requestAnimationFrame(animate)
// console.log(animationId)
 background.draw()
 boundaries.forEach(boundary => {
    boundary.draw()
 })
battleZones.forEach(battleZones => {
    // console.log(battleZones)
    battleZones.draw()

})
player.draw()
foreground.draw()

let moving = true
player.moving = false;

if(battle.initiated) return
// activate battle
if(keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed){
    for(let i = 0; i < battleZones.length; i++){
        const battleZone = battleZones[i]
        const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
        if( 
            rectangularCollision({
                rectengel1: player,
                rectengel2: battleZone
            }) && 
            overlappingArea > (player.width * player.height )/ 2 &&
            Math.random() < 0.01
             ) {
             console.log('battle activate!!!')
                // deactivate current
                window.cancelAnimationFrame(animationId)
             battle.initiated = true
             gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete(){
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete(){
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4
                            })
                        }
                    })

                    // activate battle animation loop
                    

                 
                }
            })
            //  moving = false
             break;
         }
    }
}


    if(keys.w.pressed && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprites.up
        
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if( 
                rectangularCollision({
                    rectengel1: player,
                    rectengel2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3 
                    }}
                })
                 ) {
                 console.log('collide!!!')
                 moving = false
                 break;
             }
        }

        for(let i = 0; i < battleZones.length; i++){
            const battleZone = battleZones[i]
            if( 
                rectangularCollision({
                    rectengel1: player,
                    rectengel2: battleZone
                })
                 ) {
                 console.log('battle collide!!!')
                //  moving = false
                 break;
             }
        }
        if(moving)
        movables.forEach(movable => {movable.position.y += 3})
    }
    else if (keys.a.pressed && lastKey === 'a')
    {
        player.moving = true;
        player.image = player.sprites.left
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if( 
                rectangularCollision({
                    rectengel1: player,
                    rectengel2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
                 ) {
                 console.log('collide!!!')
                 moving = false
                 break;
             }
        }
        if(moving)
        movables.forEach(movable => {movable.position.x += 3})
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if( 
                rectangularCollision({
                    rectengel1: player,
                    rectengel2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
                 ) {
                 console.log('collide!!!')
                 moving = false 
                 break;
             }
        }
        if(moving)
        movables.forEach(movable => {movable.position.y -= 3})
    }
    else if (keys.d.pressed && lastKey === 'd'){
        player.moving = true;
        player.image = player.sprites.right
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if( 
                rectangularCollision({
                    rectengel1: player,
                    rectengel2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }}
                })
                 ) {
                 console.log('collide!!!')
                 moving = false
                 break;
             }
        }
        if(moving)
        movables.forEach(movable => {movable.position.x -= 3})
    }

}



animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './images/battleBackground.png'
const battleBackround = new Sprite({
    position: {
        x: 0, 
        y: 0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image()
draggleImage.src = './images/draggleSprite.png'

const draggle = new Sprite({
    position: {
        x:800,
        y:100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
})

function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    battleBackround.draw()
    draggle.draw()
}

animate()
animateBattle()
let lastKey = ''
window.addEventListener('keydown', (e) => {
//   console.log(e.key)  
  switch(e.key){
      case 'w':
          keys.w.pressed = true
          lastKey = 'w'
      break;
      case 'a':
        keys.a.pressed = true
        lastKey = 'a'
    break;
    case 's':
        keys.s.pressed = true
        lastKey = 's'
    break;
    case 'd':
        keys.d.pressed = true
        lastKey = 'd'
    break;
  }
//   console.log(keys)
})

window.addEventListener('keyup', (e) => {
    //   console.log(e.key)  
      switch(e.key){
          case 'w':
              keys.w.pressed = false
          break;
          case 'a':
            keys.a.pressed = false
        break;
        case 's':
            keys.s.pressed = false
        break;
        case 'd':
            keys.d.pressed = false
        break;
      }
    //   console.log(keys)
    })