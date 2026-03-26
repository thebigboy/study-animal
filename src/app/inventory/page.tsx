"use client";

import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";
import { getFoodMeta } from "@/lib/game-engine";

export default function InventoryPage() {
  const { currentStudent, feed, state } = useGame();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Panel>
        <PageTitle
          eyebrow="背包"
          title={`${currentStudent?.name ?? "当前学生"} 的背包`}
          description="喂食会消耗库存，并同步提升成长值和饱腹度。"
        />

        <div className="space-y-4">
          {state.inventory.length ? (
            state.inventory.map((item) => {
              const food = getFoodMeta(item.foodType);

              if (!food) {
                return null;
              }

              return (
                <div
                  key={item.foodType}
                  className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xl font-semibold">
                      {food.emoji} {food.name} × {item.count}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {food.blurb}
                    </p>
                    <p className="mt-2 text-sm text-stone-700">
                      成长 +{food.growth} · 饱腹 +{food.satiety}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => feed(food.type)}
                    className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                  >
                    立即喂食
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-[28px] bg-stone-50 p-5 text-sm text-stone-600">
              背包里还没有食物，去商店买一点再回来吧。
            </div>
          )}
        </div>
      </Panel>

      <Panel>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
          当前状态
        </p>
        {state.pet ? (
          <div className="mt-4 space-y-3 rounded-[28px] bg-stone-50 p-5">
            <Row label="伙伴" value={state.pet.name} />
            <Row label="等级" value={`Lv.${state.pet.level}`} />
            <Row label="成长值" value={`${state.pet.growth}`} />
            <Row label="饱腹度" value={`${state.pet.satiety}`} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-600">先去认领小伙伴，再回来管理背包。</p>
        )}
      </Panel>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-600">{label}</span>
      <span className="font-semibold text-stone-900">{value}</span>
    </div>
  );
}
