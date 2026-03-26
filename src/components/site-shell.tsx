"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGame } from "@/components/game-provider";

const teacherNavItems = [
  { href: "/", label: "引导首页" },
  { href: "/dashboard", label: "教师仪表盘" },
  { href: "/classroom", label: "班级管理" },
  { href: "/study", label: "学生加减分" },
  { href: "/shop", label: "商店库存" },
];

const studentNavItems = [
  { href: "/", label: "首页" },
  { href: "/adopt", label: "认领动物" },
  { href: "/pet", label: "我的动物" },
  { href: "/shop", label: "购买食物" },
  { href: "/inventory", label: "我的背包" },
  { href: "/records", label: "成长记录" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    mode,
    classroom,
    currentStudent,
    currentTeacher,
    currentView,
    state,
    switchStudent,
    switchTeacher,
    switchView,
    resetToInitial,
  } = useGame();
  const navItems = currentView === "teacher" ? teacherNavItems : studentNavItems;
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7eb_0%,#fffaf4_35%,#eef7ef_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(126,95,54,0.12)] backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                Study Animal
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                学习认领小动物
              </h1>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                老师管理班级与库存，学生查看自己的动物并喂食成长。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:flex">
              <StatusPill label="班级" value={classroom?.className ?? "待创建"} />
              <StatusPill
                label="模式"
                value={
                  mode === "demo" ? "演示模式" : mode === "live" ? "正式模式" : "未选择"
                }
              />
              {currentView === "teacher" ? (
                <StatusPill
                  label="老师"
                  value={currentTeacher?.name ?? classroom?.teacherName ?? "未确认"}
                />
              ) : null}
              <StatusPill label="当前学生" value={currentStudent?.name ?? "待选择"} />
              <StatusPill
                label="学生积分"
                value={currentStudent ? `${state.player.points}` : "-"}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <ViewModeSwitch
                currentView={currentView}
                onChange={(view) => {
                  setStudentPickerOpen(false);
                  setTeacherPickerOpen(false);
                  switchView(view);
                }}
              />

              {currentView === "teacher" && classroom?.teachers.length ? (
                <InlinePicker
                  label="当前老师"
                  value={currentTeacher?.name ?? "未选择老师"}
                  buttonLabel={teacherPickerOpen ? "收起老师列表" : "切换老师"}
                  onToggle={() => setTeacherPickerOpen((prev) => !prev)}
                >
                  {teacherPickerOpen ? (
                    <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                      {classroom.teachers.map((teacher) => {
                        const active = teacher.id === classroom.currentTeacherId;
                        return (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => {
                              setTeacherPickerOpen(false);
                              switchTeacher(teacher.id);
                            }}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              active
                                ? "bg-stone-900 text-white"
                                : "bg-white text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            {teacher.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </InlinePicker>
              ) : null}

              {currentView === "student" && classroom?.students.length ? (
                <InlinePicker
                  label="当前学生"
                  value={
                    currentStudent
                      ? `${currentStudent.seatNo ? `${currentStudent.seatNo}号 ` : ""}${currentStudent.name}`
                      : "未选择学生"
                  }
                  buttonLabel={studentPickerOpen ? "收起学生列表" : "切换学生"}
                  onToggle={() => setStudentPickerOpen((prev) => !prev)}
                >
                  {studentPickerOpen ? (
                    <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                      {classroom.students.map((student) => {
                        const active = student.id === classroom.currentStudentId;
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => {
                              setStudentPickerOpen(false);
                              switchStudent(student.id);
                            }}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              active
                                ? "bg-orange-500 text-white"
                                : "bg-white text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            {student.seatNo ? `${student.seatNo}号 ` : ""}
                            {student.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </InlinePicker>
              ) : null}
            </div>

            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {mode ? (
          <button
            type="button"
            onClick={resetToInitial}
            className="fixed right-6 bottom-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(34,28,22,0.24)] transition hover:bg-stone-700"
          >
            {mode === "demo" ? "退出演示模式" : "回到初始状态"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ViewModeSwitch({
  currentView,
  onChange,
}: {
  currentView: "teacher" | "student";
  onChange: (view: "teacher" | "student") => void;
}) {
  return (
    <div className="inline-flex w-full max-w-[320px] flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        视角切换
      </p>
      <div className="relative inline-grid grid-cols-2 rounded-full bg-stone-100 p-1 shadow-inner">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-stone-900 shadow-[0_8px_24px_rgba(34,28,22,0.18)] transition-transform duration-300 ${
            currentView === "teacher" ? "translate-x-0" : "translate-x-full"
          }`}
        />
        <button
          type="button"
          onClick={() => onChange("teacher")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
            currentView === "teacher" ? "text-white" : "text-stone-600"
          }`}
        >
          <span className="text-base">🧑‍🏫</span>
          <span>老师视角</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("student")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
            currentView === "student" ? "text-white" : "text-stone-600"
          }`}
        >
          <span className="text-base">🧑‍🎓</span>
          <span>学生视角</span>
        </button>
      </div>
    </div>
  );
}

function InlinePicker({
  label,
  value,
  buttonLabel,
  onToggle,
  children,
}: {
  label: string;
  value: string;
  buttonLabel: string;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-3 xl:min-w-[320px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">{value}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
        >
          {buttonLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-100 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-900">{value}</p>
    </div>
  );
}
