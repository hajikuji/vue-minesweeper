<script setup lang="ts">
import type{BlockState} from '~/type'
const WIDTH = 5;
const HEIGHT = 5;
const state = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
    )
  )
);

function generateMines(initial: BlockState) {
  for (const row of state.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1) {
        continue;
      }
      if (Math.abs(initial.y - block.y) <= 1) {
        continue;
      }
      block.mine = Math.random() < 0.2;
    }
  }
  updateNumbers();
}

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

const numberColors = [
  "text-transparent",
  "text-gray-500",
  "text-yellow-500",
  "text-pink-500",
  "text-blue-500",
  "text-green-500",
  "text-red-500",
  "text-purple-500",
  "text-orange-500",
];

function updateNumbers() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine) {
        return;
      }
      getSiblings(block).forEach((b) => {
        if (b.mine) {
          block.adjacentMines += 1;
        }
      });
    });
  });
}

function getSiblings(block: BlockState) {
  const { x, y } = block;
  return directions
    .map(([dx, dy]) => {
      const x2 = x + dx;
      const y2 = y + dy;
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
        return undefined;
      }
      const block2 = state.value[y2][x2];
      return block2;
    })
    .filter(Boolean) as BlockState[];
}

function getBlockClass(block: BlockState) {
  if (!block.revealed && !block.flaged) {
    return "bg-gray-500/10 hover:bg-gray/50";
  }
  return block.mine ? "text-red" : numberColors[block.adjacentMines];
}

function expendZero(block: BlockState) {
  if (block.adjacentMines) {
    return;
  }
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true;
      expendZero(s);
    }
  });
}

let mineGenerated = false;
let dev = false;

function onRightClick(block:BlockState) {
  if(block.revealed) {
    return
  }
  block.flaged = !block.flaged
}

function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }
  block.revealed = true;
  if (block.mine) {
    alert("BOOOOOOOOOM!");
  }
  expendZero(block);
}

function checkGameState() {
  const blocks = state.value.flat()
if(blocks.every(block=>block.revealed || block.flaged)){
  if(blocks.some(block=> block.flaged && !block.mine)) {
    alert('you cheat!')
  } else {
    alert('you win')
  }
}
}
watchEffect(checkGameState)
</script>

<template>
  <div>{{ data }}</div>
  <div>
    MineSweeper
    <div p5>
      <div v-for="(row, y) in state" :key="y" flex justify-center>
        <button
          v-for="item in row"
          :key="item"
          w-10
          h-10
          :class="getBlockClass(item)"
          @contextmenu.prevent="onRightClick(item)"
          @click="onClick(item)"
          border="1 gray-400/50"
          flex
          items-center
          justify-center
        >
        <template v-if="item.flaged">
          <div>棋子</div>
        </template>
          <template v-else-if="item.revealed || dev">
            <div v-if="item.mine">x</div>
            <div v-else>{{ item.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
