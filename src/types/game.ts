export type AnimalType = "hamster" | "penguin" | "fox";

export type FoodType = "carrot" | "nuts" | "fish";

export type StudyPreset = 25 | 45;

export type PetLevel = 1 | 2 | 3;

export type FoodDefinition = {
  type: FoodType;
  name: string;
  price: number;
  growth: number;
  satiety: number;
  emoji: string;
  blurb: string;
};

export type AnimalDefinition = {
  type: AnimalType;
  name: string;
  emoji: string;
  title: string;
  motto: string;
  accent: string;
};

export type Player = {
  points: number;
  streakDays: number;
  totalStudyMinutes: number;
};

export type Pet = {
  type: AnimalType;
  name: string;
  level: PetLevel;
  growth: number;
  satiety: number;
  adoptedAt: string;
};

export type StudyRecord = {
  id: string;
  minutes: number;
  status: "completed" | "failed";
  pointsDelta: number;
  createdAt: string;
};

export type InventoryItem = {
  foodType: FoodType;
  count: number;
};

export type ShopStockItem = {
  foodType: FoodType;
  stock: number;
};

export type Transaction = {
  id: string;
  type:
    | "reward"
    | "penalty"
    | "purchase"
    | "feed"
    | "level-up"
    | "teacher-adjust";
  amount: number;
  reason: string;
  createdAt: string;
};

export type LevelEvent = {
  id: string;
  level: PetLevel;
  createdAt: string;
  message: string;
};

export type GameState = {
  player: Player;
  pet: Pet | null;
  inventory: InventoryItem[];
  studyRecords: StudyRecord[];
  transactions: Transaction[];
  levelEvents: LevelEvent[];
};

export type StudentProfile = {
  id: string;
  name: string;
  seatNo?: string;
  joinedAt: string;
  game: GameState;
};

export type TeacherProfile = {
  id: string;
  name: string;
};

export type AppMode = "demo" | "live";

export type ScoreActionLog = {
  id: string;
  teacherId: string;
  teacherName: string;
  actionType: "add" | "subtract";
  amount: number;
  reason: string;
  studentIds: string[];
  studentNames: string[];
  createdAt: string;
  mode: AppMode;
};

export type ClassroomState = {
  className: string;
  teacherName?: string;
  teacherConfirmed: boolean;
  createdAt: string;
  currentStudentId: string | null;
  currentTeacherId: string | null;
  currentView: "teacher" | "student";
  shopStock: ShopStockItem[];
  teachers: TeacherProfile[];
  students: StudentProfile[];
  actionLogs: ScoreActionLog[];
};

export type AppState = {
  mode: AppMode | null;
  classroom: ClassroomState | null;
};
