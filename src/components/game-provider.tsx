"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  adjustPoints,
  adoptPet,
  buyFood,
  createInitialState,
  feedFood,
  getFoodMeta,
} from "@/lib/game-engine";
import {
  AnimalType,
  AppMode,
  AppState,
  ClassroomState,
  FoodType,
  GameState,
  ScoreActionLog,
  ShopStockItem,
  StudentProfile,
  TeacherProfile,
} from "@/types/game";

type GameContextValue = {
  mode: AppMode | null;
  classroom: ClassroomState | null;
  currentStudent: StudentProfile | null;
  currentTeacher: TeacherProfile | null;
  state: GameState;
  currentView: "teacher" | "student";
  adopt: (animalType: AnimalType, petName: string) => void;
  buy: (foodType: FoodType) => void;
  feed: (foodType: FoodType) => void;
  createClassroom: (className: string, teacherName?: string) => void;
  confirmTeacher: () => void;
  addTeacher: (teacherName: string) => void;
  addStudent: (studentName: string, seatNo?: string) => void;
  switchStudent: (studentId: string) => void;
  switchTeacher: (teacherId: string) => void;
  switchView: (view: "teacher" | "student") => void;
  restockFood: (foodType: FoodType, amount: number) => void;
  batchAdjustPoints: (
    studentIds: string[],
    mode: "add" | "subtract",
    amount: number,
    reason: string,
  ) => void;
  enterDemoMode: () => void;
  enterLiveMode: () => void;
  resetToInitial: () => void;
  reset: () => void;
};

const STORAGE_KEY = "study-animal-app-state";

const GameContext = createContext<GameContextValue | null>(null);

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const DEFAULT_SHOP_STOCK: ShopStockItem[] = [
  { foodType: "carrot", stock: 12 },
  { foodType: "nuts", stock: 8 },
  { foodType: "fish", stock: 5 },
];

const DEMO_TEACHER_NAMES = ["王老师", "李老师", "张老师", "陈老师", "刘老师"];

const cloneDefaultShopStock = () =>
  DEFAULT_SHOP_STOCK.map((item) => ({ ...item }));

const createTeacher = (name: string): TeacherProfile => ({
  id: makeId(),
  name,
});

const createStudent = (name: string, seatNo?: string): StudentProfile => ({
  id: makeId(),
  name: name.trim() || "未命名学生",
  seatNo: seatNo?.trim() || undefined,
  joinedAt: new Date().toISOString(),
  game: createInitialState(),
});

const createEmptyAppState = (): AppState => ({
  mode: null,
  classroom: null,
});

const createLiveClassroom = (): ClassroomState => ({
  className: "默认班级",
  teacherName: undefined,
  teacherConfirmed: false,
  createdAt: new Date().toISOString(),
  currentStudentId: null,
  currentTeacherId: null,
  currentView: "teacher",
  shopStock: cloneDefaultShopStock(),
  teachers: [],
  students: [],
  actionLogs: [],
});

const createDemoAppState = (): AppState => {
  const teachers = DEMO_TEACHER_NAMES.map((name) => createTeacher(name));
  const students = Array.from({ length: 50 }, (_, index) => {
    const base = createStudent(`学生${String(index + 1).padStart(2, "0")}`, `${index + 1}`);

    if (index % 2 === 0) {
      const animalType = (["hamster", "penguin", "fox"] as AnimalType[])[index % 3];
      const adopted = adoptPet(base.game, animalType, `伙伴${index + 1}`);
      const pointsBoost = adjustPoints(adopted, 10 + (index % 4) * 5, "演示初始积分");
      return {
        ...base,
        game: pointsBoost,
      };
    }

    return {
      ...base,
      game: adjustPoints(base.game, 5 + (index % 3) * 3, "演示初始积分"),
    };
  });

  return {
    mode: "demo",
    classroom: {
      className: "演示班级",
      teacherName: teachers[0]?.name,
      teacherConfirmed: true,
      createdAt: new Date().toISOString(),
      currentStudentId: students[0]?.id ?? null,
      currentTeacherId: teachers[0]?.id ?? null,
      currentView: "teacher",
      shopStock: [
        { foodType: "carrot", stock: 80 },
        { foodType: "nuts", stock: 60 },
        { foodType: "fish", stock: 40 },
      ],
      teachers,
      students,
      actionLogs: [],
    },
  };
};

const normalizeClassroom = (classroom: ClassroomState): ClassroomState => ({
  ...classroom,
  teacherConfirmed: classroom.teacherConfirmed ?? false,
  currentTeacherId: classroom.currentTeacherId ?? classroom.teachers?.[0]?.id ?? null,
  currentView: classroom.currentView ?? "teacher",
  shopStock:
    classroom.shopStock?.length
      ? classroom.shopStock.map((item) => ({ ...item }))
      : cloneDefaultShopStock(),
  teachers: classroom.teachers ?? [],
  actionLogs: classroom.actionLogs ?? [],
});

const normalizeAppState = (raw: AppState | ClassroomState): AppState => {
  if ("mode" in raw) {
    return {
      mode: raw.mode ?? null,
      classroom: raw.classroom ? normalizeClassroom(raw.classroom) : null,
    };
  }

  return {
    mode: "live",
    classroom: normalizeClassroom(raw),
  };
};

const updateCurrentStudentGame = (
  classroom: ClassroomState | null,
  updater: (game: GameState) => GameState,
) => {
  if (!classroom || !classroom.currentStudentId) {
    return classroom;
  }

  return {
    ...classroom,
    students: classroom.students.map((student) =>
      student.id === classroom.currentStudentId
        ? { ...student, game: updater(student.game) }
        : student,
    ),
  };
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const emptyState = useMemo(() => createInitialState(), []);
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window === "undefined") {
      return createEmptyAppState();
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? normalizeAppState(JSON.parse(raw) as AppState | ClassroomState)
      : createEmptyAppState();
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    if (appState.mode || appState.classroom) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [appState]);

  const classroom = appState.classroom;
  const currentStudent =
    classroom?.students.find((student) => student.id === classroom.currentStudentId) ??
    null;
  const currentTeacher =
    classroom?.teachers.find((teacher) => teacher.id === classroom.currentTeacherId) ??
    null;
  const state = currentStudent?.game ?? emptyState;

  const value = useMemo<GameContextValue>(
    () => ({
      mode: appState.mode,
      classroom,
      currentStudent,
      currentTeacher,
      state,
      currentView: classroom?.currentView ?? "teacher",
      adopt: (animalType, petName) =>
        setAppState((prev) => ({
          ...prev,
          classroom: updateCurrentStudentGame(prev.classroom, (game) =>
            adoptPet(game, animalType, petName),
          ),
        })),
      buy: (foodType) =>
        setAppState((prev) => {
          const currentClassroom = prev.classroom;

          if (!currentClassroom) {
            return prev;
          }

          const stock = currentClassroom.shopStock.find(
            (item) => item.foodType === foodType,
          );
          const food = getFoodMeta(foodType);
          const student = currentClassroom.currentStudentId
            ? currentClassroom.students.find(
                (item) => item.id === currentClassroom.currentStudentId,
              )
            : null;

          if (!stock || stock.stock <= 0 || !food || !student) {
            return prev;
          }

          if (student.game.player.points < food.price) {
            return prev;
          }

          return {
            ...prev,
            classroom: {
              ...updateCurrentStudentGame(currentClassroom, (game) =>
                buyFood(game, foodType),
              )!,
              shopStock: currentClassroom.shopStock.map((item) =>
                item.foodType === foodType
                  ? { ...item, stock: Math.max(0, item.stock - 1) }
                  : item,
              ),
            },
          };
        }),
      feed: (foodType) =>
        setAppState((prev) => ({
          ...prev,
          classroom: updateCurrentStudentGame(prev.classroom, (game) =>
            feedFood(game, foodType),
          ),
        })),
      createClassroom: (className, teacherName) =>
        setAppState((prev) => {
          const teacher = teacherName?.trim()
            ? createTeacher(teacherName.trim())
            : null;

          if (prev.classroom) {
            const teachers =
              teacher &&
              !prev.classroom.teachers.some((item) => item.name === teacher.name)
                ? [...prev.classroom.teachers, teacher]
                : prev.classroom.teachers;
            const existingTeacher =
              prev.classroom.teachers.find((item) => item.name === teacherName?.trim()) ??
              teacher ??
              null;

            return {
              mode: prev.mode ?? "live",
              classroom: {
                ...prev.classroom,
                className: className.trim() || prev.classroom.className,
                teacherName: teacherName?.trim() || prev.classroom.teacherName,
                teacherConfirmed:
                  prev.classroom.teacherConfirmed || Boolean(teacherName?.trim()),
                currentTeacherId:
                  existingTeacher?.id ?? prev.classroom.currentTeacherId,
                teachers,
              },
            };
          }

          return {
            mode: prev.mode ?? "live",
            classroom: {
              ...createLiveClassroom(),
              className: className.trim() || "默认班级",
              teacherName: teacherName?.trim() || undefined,
              teachers: teacher ? [teacher] : [],
              currentTeacherId: teacher?.id ?? null,
            },
          };
        }),
      confirmTeacher: () =>
        setAppState((prev) => ({
          ...prev,
          classroom: prev.classroom
            ? {
                ...prev.classroom,
                teacherConfirmed: true,
              }
            : prev.classroom,
        })),
      addTeacher: (teacherName) =>
        setAppState((prev) => {
          if (!prev.classroom || !teacherName.trim()) {
            return prev;
          }

          const existing = prev.classroom.teachers.find(
            (item) => item.name === teacherName.trim(),
          );
          const teacher = existing ?? createTeacher(teacherName.trim());

          return {
            ...prev,
            classroom: {
              ...prev.classroom,
              teachers: existing
                ? prev.classroom.teachers
                : [...prev.classroom.teachers, teacher],
              currentTeacherId: teacher.id,
              teacherName: teacher.name,
            },
          };
        }),
      addStudent: (studentName, seatNo) =>
        setAppState((prev) => {
          const baseClassroom = prev.classroom ?? createLiveClassroom();
          const student = createStudent(studentName, seatNo);

          return {
            mode: prev.mode ?? "live",
            classroom: {
              ...baseClassroom,
              currentStudentId: student.id,
              students: [...baseClassroom.students, student],
            },
          };
        }),
      switchStudent: (studentId) =>
        setAppState((prev) => ({
          ...prev,
          classroom: prev.classroom
            ? {
                ...prev.classroom,
                currentStudentId: studentId,
              }
            : prev.classroom,
        })),
      switchTeacher: (teacherId) =>
        setAppState((prev) => ({
          ...prev,
          classroom: prev.classroom
            ? {
                ...prev.classroom,
                currentTeacherId: teacherId,
                teacherName:
                  prev.classroom.teachers.find((item) => item.id === teacherId)?.name ??
                  prev.classroom.teacherName,
              }
            : prev.classroom,
        })),
      switchView: (view) =>
        setAppState((prev) => ({
          ...prev,
          classroom: prev.classroom
            ? {
                ...prev.classroom,
                currentView: view,
              }
            : prev.classroom,
        })),
      restockFood: (foodType, amount) =>
        setAppState((prev) => {
          if (!prev.classroom || amount <= 0) {
            return prev;
          }

          return {
            ...prev,
            classroom: {
              ...prev.classroom,
              shopStock: prev.classroom.shopStock.map((item) =>
                item.foodType === foodType
                  ? { ...item, stock: item.stock + amount }
                  : item,
              ),
            },
          };
        }),
      batchAdjustPoints: (studentIds, mode, amount, reason) =>
        setAppState((prev) => {
          if (
            !prev.classroom ||
            !studentIds.length ||
            amount <= 0 ||
            !prev.classroom.currentTeacherId
          ) {
            return prev;
          }

          const teacher = prev.classroom.teachers.find(
            (item) => item.id === prev.classroom?.currentTeacherId,
          );

          if (!teacher) {
            return prev;
          }

          const delta = mode === "add" ? amount : -amount;
          const selectedStudents = prev.classroom.students.filter((student) =>
            studentIds.includes(student.id),
          );

          const log: ScoreActionLog = {
            id: makeId(),
            teacherId: teacher.id,
            teacherName: teacher.name,
            actionType: mode,
            amount,
            reason: reason || "课堂表现",
            studentIds: selectedStudents.map((student) => student.id),
            studentNames: selectedStudents.map((student) => student.name),
            createdAt: new Date().toISOString(),
            mode: prev.mode ?? "live",
          };

          return {
            ...prev,
            classroom: {
              ...prev.classroom,
              actionLogs: [log, ...prev.classroom.actionLogs],
              students: prev.classroom.students.map((student) =>
                studentIds.includes(student.id)
                  ? {
                      ...student,
                      game: adjustPoints(
                        student.game,
                        delta,
                        `${teacher.name}${mode === "add" ? "加分" : "减分"}：${reason || "课堂表现"}`,
                      ),
                    }
                  : student,
              ),
            },
          };
        }),
      enterDemoMode: () => setAppState(createDemoAppState()),
      enterLiveMode: () =>
        setAppState({
          mode: "live",
          classroom: createLiveClassroom(),
        }),
      resetToInitial: () => setAppState(createEmptyAppState()),
      reset: () =>
        setAppState((prev) => ({
          ...prev,
          classroom:
            prev.classroom && prev.classroom.currentStudentId
              ? {
                  ...prev.classroom,
                  students: prev.classroom.students.map((student) =>
                    student.id === prev.classroom?.currentStudentId
                      ? { ...student, game: createInitialState() }
                      : student,
                  ),
                }
              : prev.classroom,
        })),
    }),
    [appState.mode, classroom, currentStudent, currentTeacher, state],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}
