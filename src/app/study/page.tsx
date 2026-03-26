"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";

export default function StudyPage() {
  const { batchAdjustPoints, classroom, currentTeacher, mode } = useGame();
  const [actionMode, setActionMode] = useState<"add" | "subtract">("add");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState("");
  const [keyword, setKeyword] = useState("");

  const students = useMemo(() => classroom?.students ?? [], [classroom?.students]);
  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const q = keyword.trim().toLowerCase();

        if (!q) {
          return true;
        }

        return (
          student.name.toLowerCase().includes(q) ||
          (student.seatNo ?? "").toLowerCase().includes(q)
        );
      }),
    [keyword, students],
  );

  const selectedStudents = useMemo(
    () => students.filter((student) => selectedIds.includes(student.id)),
    [selectedIds, students],
  );

  const canSubmit = classroom?.teacherConfirmed && selectedIds.length > 0 && amount > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Panel>
        <PageTitle
          eyebrow="老师积分"
          title="由老师统一给学生加分或减分"
          description="先选择加分或减分，再单选或多选学生，最后保存执行。这个模块已经替换原先的学习结算。"
        />

        <div className="mb-6 rounded-[24px] bg-stone-50 px-4 py-3 text-sm text-stone-700">
          当前老师：<span className="font-semibold">{currentTeacher?.name ?? "未选择"}</span>
          {" · "}
          当前模式：<span className="font-semibold">{mode === "demo" ? "演示模式" : "正式模式"}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: "add", title: "加分", desc: "用于表扬、作业完成、课堂表现优秀" },
            { key: "subtract", title: "减分", desc: "用于提醒、未完成任务、课堂纪律扣分" },
          ].map((item) => {
            const active = actionMode === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActionMode(item.key as "add" | "subtract")}
                className={`rounded-[28px] border p-5 text-left transition ${
                  active
                    ? item.key === "add"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-rose-600 bg-rose-600 text-white"
                    : "border-stone-200 bg-stone-50 hover:border-stone-300"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.24em] opacity-70">操作</p>
                <p className="mt-3 text-3xl font-semibold">{item.title}</p>
                <p className="mt-3 text-sm leading-6 opacity-85">{item.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="text-sm font-medium text-stone-700">选择学生</label>
              <div className="flex flex-wrap gap-2">
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索姓名 / 座号"
                  className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none md:w-56"
                />
                <button
                  type="button"
                  onClick={() => setSelectedIds(filteredStudents.map((student) => student.id))}
                  className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700"
                >
                  全选当前列表
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700"
                >
                  清空选择
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-[24px] border border-stone-200 bg-stone-50 p-3">
              <div className="mb-2 grid grid-cols-[1.4fr_0.8fr_0.8fr] px-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <span>学生</span>
                <span>积分</span>
                <span>选择</span>
              </div>
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {filteredStudents.length ? (
                  filteredStudents.map((student) => {
                  const active = selectedIds.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() =>
                        setSelectedIds((prev) =>
                          active
                            ? prev.filter((item) => item !== student.id)
                            : [...prev, student.id],
                        )
                      }
                      className={`grid w-full grid-cols-[1.4fr_0.8fr_0.8fr] items-center rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">
                          {student.seatNo ? `${student.seatNo}号 ` : ""}
                          {student.name}
                        </p>
                        <p className={`mt-1 text-xs ${active ? "text-white/75" : "text-stone-500"}`}>
                          {student.game.pet ? `已认领 ${student.game.pet.name}` : "未认领"}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{student.game.player.points}</p>
                      <div className="flex justify-start md:justify-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-white text-stone-700"
                          }`}
                        >
                          {active ? "已选中" : "点击选择"}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-6 text-sm text-stone-600">
                  {students.length ? "没有匹配的学生。" : "请先到班级页添加学生。"}
                </p>
              )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-stone-700">分值</label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value) || 0)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">原因</label>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="例如：课堂回答积极 / 作业未完成"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              batchAdjustPoints(selectedIds, actionMode, amount, reason);
              setSelectedIds([]);
              setReason("");
            }}
            className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:bg-stone-300 ${
              actionMode === "add" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            保存并{actionMode === "add" ? "加分" : "减分"}
          </button>
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            本次操作预览
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PreviewCard label="操作类型" value={actionMode === "add" ? "加分" : "减分"} />
            <PreviewCard label="选中人数" value={`${selectedIds.length} 人`} />
            <PreviewCard label="分值" value={`${amount} 分`} />
            <PreviewCard label="原因" value={reason || "课堂表现"} />
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            已选学生
          </p>
          <div className="mt-4">
            {selectedStudents.length ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {selectedStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() =>
                        setSelectedIds((prev) => prev.filter((item) => item !== student.id))
                      }
                      className="rounded-full bg-stone-100 px-3 py-2 text-sm font-medium text-stone-800"
                    >
                      {student.seatNo ? `${student.seatNo}号 ` : ""}
                      {student.name} ×
                    </button>
                  ))}
                </div>
                <div className="mt-4 max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {selectedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          当前 {student.game.player.points} 分
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          调整后
                        </p>
                        <p className="mt-1 font-semibold text-stone-900">
                          {Math.max(
                            0,
                            student.game.player.points +
                              (actionMode === "add" ? amount : -amount),
                          )}{" "}
                          分
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-stone-600">请先选择一个或多个学生。</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-stone-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}
