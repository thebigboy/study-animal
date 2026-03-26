"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";

export default function ClassroomPage() {
  const {
    classroom,
    currentStudent,
    createClassroom,
    confirmTeacher,
    addTeacher,
    addStudent,
    switchStudent,
  } = useGame();
  const [className, setClassName] = useState(classroom?.className ?? "一年一班");
  const [teacherName, setTeacherName] = useState(classroom?.teacherName ?? "班主任");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [seatNo, setSeatNo] = useState("");

  const ranking = useMemo(
    () =>
      [...(classroom?.students ?? [])].sort(
        (left, right) => right.game.player.points - left.game.player.points,
      ),
    [classroom],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-6">
        <Panel>
          <PageTitle
            eyebrow="班级模式"
            title={
              classroom
                ? classroom.teacherConfirmed
                  ? "班级已准备好，可以开始管理学生"
                  : "请先确认老师身份"
                : "欢迎使用班级认领模式"
            }
            description="如果还没有班级，请先创建班级；创建后确认“您是 xx 老师”，再添加学生进入认领流程。"
          />

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">班级名称</label>
              <input
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                placeholder="例如：三年二班"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">教师称呼</label>
              <input
                value={teacherName}
                onChange={(event) => setTeacherName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                placeholder="例如：李老师"
              />
            </div>
            <button
              type="button"
              onClick={() => createClassroom(className, teacherName)}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
            >
              {classroom ? "更新班级信息" : "创建班级"}
            </button>

            {classroom?.teacherName ? (
              <button
                type="button"
                onClick={confirmTeacher}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${
                  classroom.teacherConfirmed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-500 text-white"
                }`}
              >
                {classroom.teacherConfirmed
                  ? `已确认：您是 ${classroom.teacherName}`
                  : `确认：您是 ${classroom.teacherName}？`}
              </button>
            ) : null}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            老师身份
          </p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">新增老师</label>
              <input
                value={newTeacherName}
                onChange={(event) => setNewTeacherName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                placeholder="例如：赵老师"
              />
            </div>
            <button
              type="button"
              disabled={!classroom}
              onClick={() => {
                addTeacher(newTeacherName);
                setNewTeacherName("");
              }}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-stone-300"
            >
              添加老师并切换身份
            </button>
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            添加学生
          </p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700">学生姓名</label>
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                placeholder="例如：张小明"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">学号 / 座号</label>
              <input
                value={seatNo}
                onChange={(event) => setSeatNo(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                placeholder="例如：12"
              />
            </div>
            <button
              type="button"
              disabled={!classroom?.teacherConfirmed}
              onClick={() => {
                addStudent(studentName, seatNo);
                setStudentName("");
                setSeatNo("");
              }}
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white disabled:bg-stone-300"
            >
              添加学生并切换到该学生
            </button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            班级概览
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <SummaryCard label="班级" value={classroom?.className ?? "未创建"} />
            <SummaryCard
              label="教师"
              value={classroom?.teacherName ?? "未填写"}
            />
            <SummaryCard
              label="老师数"
              value={`${classroom?.teachers.length ?? 0}`}
            />
            <SummaryCard
              label="学生数"
              value={`${classroom?.students.length ?? 0}`}
            />
            <SummaryCard
              label="当前学生"
              value={currentStudent?.name ?? "未选择"}
            />
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            学生列表
          </p>
          <div className="mt-4 space-y-3">
            {classroom?.students.length ? (
              classroom.students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => switchStudent(student.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${
                    student.id === classroom.currentStudentId
                      ? "bg-stone-900 text-white"
                      : "bg-stone-50 text-stone-900"
                  }`}
                >
                  <div>
                    <p className="font-semibold">
                      {student.seatNo ? `${student.seatNo}号 ` : ""}
                      {student.name}
                    </p>
                    <p
                      className={`mt-1 text-sm ${
                        student.id === classroom.currentStudentId
                          ? "text-white/75"
                          : "text-stone-600"
                      }`}
                    >
                      积分 {student.game.player.points} · 宠物{" "}
                      {student.game.pet ? student.game.pet.name : "待认领"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    Lv.{student.game.pet?.level ?? 0}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-stone-600">先创建班级并添加学生。</p>
            )}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            积分榜
          </p>
          <div className="mt-4 space-y-3">
            {ranking.length ? (
              ranking.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">
                      #{index + 1} {student.name}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      学习 {student.game.player.totalStudyMinutes} 分钟
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                    {student.game.player.points} 分
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-600">添加学生后，这里会自动生成班级积分榜。</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}
