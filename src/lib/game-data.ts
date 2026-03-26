import { AnimalDefinition, FoodDefinition, PetLevel, StudyPreset } from "@/types/game";

export const ANIMALS: AnimalDefinition[] = [
  {
    type: "hamster",
    name: "仓鼠",
    emoji: "🐹",
    title: "零食收藏家",
    motto: "今天也要把知识一点点藏进小脸颊。",
    accent: "#ffb86c",
  },
  {
    type: "penguin",
    name: "小企鹅",
    emoji: "🐧",
    title: "专注巡航员",
    motto: "稳稳前进，每次学习都算数。",
    accent: "#7cc7ff",
  },
  {
    type: "fox",
    name: "小狐狸",
    emoji: "🦊",
    title: "灵感探险家",
    motto: "积累一点火花，就能照亮整片森林。",
    accent: "#ff7a59",
  },
];

export const FOODS: FoodDefinition[] = [
  {
    type: "carrot",
    name: "胡萝卜片",
    price: 8,
    growth: 6,
    satiety: 10,
    emoji: "🥕",
    blurb: "基础食物，适合每天补充一点成长能量。",
  },
  {
    type: "nuts",
    name: "坚果包",
    price: 15,
    growth: 12,
    satiety: 16,
    emoji: "🥜",
    blurb: "性价比最佳，适合稳定推进升级节奏。",
  },
  {
    type: "fish",
    name: "小鱼干",
    price: 25,
    growth: 22,
    satiety: 24,
    emoji: "🐟",
    blurb: "稀有加餐，用来冲级非常合适。",
  },
];

export const STUDY_REWARDS: Record<StudyPreset, number> = {
  25: 12,
  45: 20,
};

export const FAILURE_PENALTY = 5;
export const FIRST_STUDY_BONUS = 5;

export const LEVEL_THRESHOLDS: Record<PetLevel, number> = {
  1: 0,
  2: 100,
  3: 260,
};

export const MAX_SATIETY = 100;
export const INITIAL_POINTS = 20;
