"use client";

import { useMemo } from "react";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";
import { getAnimalMeta, getFoodMeta } from "@/lib/game-engine";

export default function DashboardPage() {
  const { classroom, currentTeacher, mode } = useGame();

  const students = useMemo(() => classroom?.students ?? [], [classroom?.students]);
  const totalPoints = useMemo(
    () => students.reduce((sum, student) => sum + student.game.player.points, 0),
    [students],
  );
  const adoptedCount = useMemo(
    () => students.filter((student) => student.game.pet).length,
    [students],
  );

  return (
    <div className="grid gap-6">
      <Panel>
        <PageTitle
          eyebrow="教师仪表盘"
          title="从老师视角查看整个班级的养成情况"
          description="这里可以看到所有学生的积分、宠物认领情况，以及当前商店库存概览。"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="班级" value={classroom?.className ?? "未创建"} />
          <Metric label="模式" value={mode === "demo" ? "演示模式" : "正式模式"} />
          <Metric label="当前老师" value={currentTeacher?.name ?? "未选择"} />
          <Metric label="学生数" value={`${students.length}`} />
          <Metric label="总积分" value={`${totalPoints}`} />
          <Metric label="已认领" value={`${adoptedCount} / ${students.length}`} />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            学生与宠物总览
          </p>
          <div className="mt-4 space-y-3">
            {students.length ? (
              students.map((student) => {
                const animal = student.game.pet
                  ? getAnimalMeta(student.game.pet.type)
                  : null;

                return (
                  <div
                    key={student.id}
                    className="grid gap-3 rounded-[26px] bg-stone-50 px-4 py-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]"
                  >
                    <div>
                      <p className="font-semibold">
                        {student.seatNo ? `${student.seatNo}号 ` : ""}
                        {student.name}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {student.game.pet
                          ? `${animal?.emoji} ${student.game.pet.name} · Lv.${student.game.pet.level}`
                          : "尚未认领动物"}
                      </p>
                    </div>
                    <Stat label="积分" value={`${student.game.player.points}`} />
                    <Stat
                      label="成长"
                      value={
                        student.game.pet ? `${student.game.pet.growth}` : "-"
                      }
                    />
                    <Stat
                      label="背包"
                      value={`${student.game.inventory.reduce((sum, item) => sum + item.count, 0)}`}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-stone-600">请先在班级页添加学生。</p>
            )}
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              商店库存概览
            </p>
            <div className="mt-4 space-y-3">
              {(classroom?.shopStock ?? []).map((item) => {
                const food = getFoodMeta(item.foodType);

                if (!food) {
                  return null;
                }

                return (
                  <div
                    key={item.foodType}
                    className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {food.emoji} {food.name}
                      </p>
                      <p className="text-sm text-stone-600">
                        单价 {food.price} 积分
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                      库存 {item.stock}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              待关注学生
            </p>
            <div className="mt-4 space-y-3">
              {students
                .filter((student) => !student.game.pet || student.game.player.points < 10)
                .slice(0, 4)
                .map((student) => (
                  <div key={student.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="font-semibold">{student.name}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {!student.game.pet
                        ? "还未认领动物"
                        : `当前积分较低：${student.game.player.points}`}
                    </p>
                  </div>
                ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              最近操作日志
            </p>
            <div className="mt-4 space-y-3">
              {(classroom?.actionLogs ?? []).slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                  <p className="font-semibold">
                    {log.teacherName}
                    {log.actionType === "add" ? " 加分 " : " 减分 "}
                    {log.amount}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {log.studentNames.join("、")} · {log.reason}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {new Date(log.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 font-semibold text-stone-900">{value}</p>
    </div>
  );
}
