"use client";

import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";

export default function RecordsPage() {
  const { classroom, currentStudent, reset, state } = useGame();
  const scoreEvents = state.transactions.filter(
    (item) =>
      item.type === "teacher-adjust" ||
      item.type === "reward" ||
      item.type === "penalty",
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-6">
        <Panel>
          <PageTitle
            eyebrow="记录"
            title={`${currentStudent?.name ?? "当前学生"} 的得分记录`}
            description={`班级：${classroom?.className ?? "未创建"}。记录页用于展示积分变化、消费去向和成长过程。`}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="得分变动次数" value={`${scoreEvents.length}`} />
            <Metric label="当前积分" value={`${state.player.points}`} />
            <Metric label="升级次数" value={`${state.levelEvents.length}`} />
            <Metric
              label="背包食物"
              value={`${state.inventory.reduce((sum, item) => sum + item.count, 0)}`}
            />
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            调试动作
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            这个按钮会清空本地存档，方便你重新体验首次认领和新手引导。
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            重置本地存档
          </button>
        </Panel>
      </div>

      <Panel>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
          时间线
        </p>
        <div className="mt-4 space-y-3">
          {state.transactions.length ? (
            state.transactions.slice(0, 12).map((item) => (
              <div key={item.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-stone-900">{item.reason}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.amount > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : item.amount < 0
                          ? "bg-rose-100 text-rose-700"
                          : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}
                  </span>
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  {new Date(item.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-600">还没有任何记录。</p>
          )}
        </div>
      </Panel>
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
