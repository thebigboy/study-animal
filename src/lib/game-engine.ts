import {
  ANIMALS,
  FAILURE_PENALTY,
  FIRST_STUDY_BONUS,
  FOODS,
  INITIAL_POINTS,
  LEVEL_THRESHOLDS,
  MAX_SATIETY,
  STUDY_REWARDS,
} from "@/lib/game-data";
import {
  AnimalType,
  FoodType,
  GameState,
  InventoryItem,
  PetLevel,
  StudyPreset,
  Transaction,
} from "@/types/game";

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const ensureInventory = (inventory: InventoryItem[], foodType: FoodType) => {
  const existing = inventory.find((item) => item.foodType === foodType);

  if (existing) {
    existing.count += 1;
    return inventory;
  }

  return [...inventory, { foodType, count: 1 }];
};

const reduceInventory = (inventory: InventoryItem[], foodType: FoodType) =>
  inventory
    .map((item) =>
      item.foodType === foodType ? { ...item, count: item.count - 1 } : item,
    )
    .filter((item) => item.count > 0);

const getLevelFromGrowth = (growth: number): PetLevel => {
  if (growth >= LEVEL_THRESHOLDS[3]) {
    return 3;
  }

  if (growth >= LEVEL_THRESHOLDS[2]) {
    return 2;
  }

  return 1;
};

const createTransaction = (
  type: Transaction["type"],
  amount: number,
  reason: string,
): Transaction => ({
  id: makeId(),
  type,
  amount,
  reason,
  createdAt: new Date().toISOString(),
});

export const createInitialState = (): GameState => ({
  player: {
    points: INITIAL_POINTS,
    streakDays: 1,
    totalStudyMinutes: 0,
  },
  pet: null,
  inventory: [{ foodType: "carrot", count: 1 }],
  studyRecords: [],
  transactions: [
    createTransaction("reward", INITIAL_POINTS, "新手欢迎积分"),
    createTransaction("reward", 0, "背包赠送胡萝卜片 x1"),
  ],
  levelEvents: [],
});

export const adoptPet = (
  state: GameState,
  animalType: AnimalType,
  petName: string,
): GameState => {
  const animal = ANIMALS.find((entry) => entry.type === animalType);

  if (!animal) {
    return state;
  }

  return {
    ...state,
    pet: {
      type: animalType,
      name: petName.trim() || `${animal.name}同学`,
      level: 1,
      growth: 0,
      satiety: 72,
      adoptedAt: new Date().toISOString(),
    },
    transactions: [
      createTransaction("reward", 0, `成功认领${animal.name}`),
      ...state.transactions,
    ],
  };
};

export const completeStudy = (
  state: GameState,
  minutes: StudyPreset,
): GameState => {
  const reward = STUDY_REWARDS[minutes];
  const isFirstStudy = !state.studyRecords.some(
    (record) => record.status === "completed",
  );
  const bonus = isFirstStudy ? FIRST_STUDY_BONUS : 0;
  const totalReward = reward + bonus;

  return {
    ...state,
    player: {
      ...state.player,
      points: state.player.points + totalReward,
      totalStudyMinutes: state.player.totalStudyMinutes + minutes,
    },
    studyRecords: [
      {
        id: makeId(),
        minutes,
        status: "completed",
        pointsDelta: totalReward,
        createdAt: new Date().toISOString(),
      },
      ...state.studyRecords,
    ],
    transactions: [
      createTransaction("reward", reward, `完成${minutes}分钟学习`),
      ...(bonus
        ? [createTransaction("reward", bonus, "今日首次学习奖励")]
        : []),
      ...state.transactions,
    ],
  };
};

export const failStudy = (state: GameState, minutes: StudyPreset): GameState => ({
  ...state,
  player: {
    ...state.player,
    points: Math.max(0, state.player.points - FAILURE_PENALTY),
  },
  studyRecords: [
    {
      id: makeId(),
      minutes,
      status: "failed",
      pointsDelta: -FAILURE_PENALTY,
      createdAt: new Date().toISOString(),
    },
    ...state.studyRecords,
  ],
  transactions: [
    createTransaction("penalty", -FAILURE_PENALTY, `放弃${minutes}分钟学习`),
    ...state.transactions,
  ],
});

export const buyFood = (state: GameState, foodType: FoodType): GameState => {
  const food = FOODS.find((item) => item.type === foodType);

  if (!food || state.player.points < food.price) {
    return state;
  }

  return {
    ...state,
    player: {
      ...state.player,
      points: state.player.points - food.price,
    },
    inventory: ensureInventory([...state.inventory], foodType),
    transactions: [
      createTransaction("purchase", -food.price, `购买${food.name}`),
      ...state.transactions,
    ],
  };
};

export const feedFood = (state: GameState, foodType: FoodType): GameState => {
  if (!state.pet) {
    return state;
  }

  const food = FOODS.find((item) => item.type === foodType);
  const owned = state.inventory.find((item) => item.foodType === foodType);

  if (!food || !owned || owned.count < 1) {
    return state;
  }

  const nextGrowth = state.pet.growth + food.growth;
  const nextLevel = getLevelFromGrowth(nextGrowth);
  const didLevelUp = nextLevel > state.pet.level;

  return {
    ...state,
    pet: {
      ...state.pet,
      growth: nextGrowth,
      level: nextLevel,
      satiety: Math.min(MAX_SATIETY, state.pet.satiety + food.satiety),
    },
    inventory: reduceInventory(state.inventory, foodType),
    transactions: [
      createTransaction("feed", 0, `喂食${food.name}，成长 +${food.growth}`),
      ...(didLevelUp
        ? [createTransaction("level-up", 0, `升级到 Lv.${nextLevel}`)]
        : []),
      ...state.transactions,
    ],
    levelEvents: didLevelUp
      ? [
          {
            id: makeId(),
            level: nextLevel,
            createdAt: new Date().toISOString(),
            message: `恭喜！${state.pet.name} 升级到 Lv.${nextLevel}`,
          },
          ...state.levelEvents,
        ]
      : state.levelEvents,
  };
};

export const adjustPoints = (
  state: GameState,
  amount: number,
  reason: string,
): GameState => ({
  ...state,
  player: {
    ...state.player,
    points: Math.max(0, state.player.points + amount),
  },
  transactions: [
    createTransaction("teacher-adjust", amount, reason),
    ...state.transactions,
  ],
});

export const getAnimalMeta = (animalType: AnimalType) =>
  ANIMALS.find((item) => item.type === animalType);

export const getFoodMeta = (foodType: FoodType) =>
  FOODS.find((item) => item.type === foodType);

export const getNextThreshold = (level: PetLevel) =>
  level === 1 ? LEVEL_THRESHOLDS[2] : level === 2 ? LEVEL_THRESHOLDS[3] : LEVEL_THRESHOLDS[3];
