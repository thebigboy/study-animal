"use client";

import Link from "next/link";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";
import { getAnimalMeta, getFoodMeta, getNextThreshold } from "@/lib/game-engine";

export default function PetPage() {
  const { currentStudent, state, feed } = useGame();
  const pet = state.pet;

  if (!currentStudent) {
    return (
      <Panel>
        <PageTitle
          eyebrow="小窝"
          title="请先在班级中选择学生"
          description="班级模式下，每个学生拥有独立的小窝和学习记录。"
        />
        <Link
          href="/classroom"
          className="inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
        >
          去班级页
        </Link>
      </Panel>
    );
  }

  if (!pet) {
    return (
      <Panel>
        <PageTitle
          eyebrow="小窝"
          title={`${currentStudent.name} 还没有认领学习伙伴`}
          description="先去认领一只小动物，再回来开始完整的学习养成闭环。"
        />
        <Link
          href="/adopt"
          className="inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
        >
          去认领
        </Link>
      </Panel>
    );
  }

  const animal = getAnimalMeta(pet.type);
  const nextThreshold = getNextThreshold(pet.level);
  const progress = Math.min(100, (pet.growth / nextThreshold) * 100);
  const topInventory = state.inventory[0];
  const topFood = topInventory ? getFoodMeta(topInventory.foodType) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Panel>
        <PageTitle
          eyebrow="我的小窝"
          title={`${currentStudent.name} 的 ${pet.name} 正在认真长大`}
          description="主页聚合了当前伙伴状态、成长进度和最重要的四个动作。"
        />

        <div className="rounded-[36px] bg-[linear-gradient(180deg,#fff6ea_0%,#f6f7ef_100%)] p-6 text-center">
          <div className="text-8xl md:text-9xl">{animal?.emoji}</div>
          <h3 className="mt-4 text-3xl font-semibold">{pet.name}</h3>
          <p className="mt-2 text-sm text-stone-600">
            Lv.{pet.level} · {animal?.name} · {animal?.title}
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-600">
            {animal?.motto}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <StatCard
            label="成长值"
            value={`${pet.growth} / ${nextThreshold}`}
            extra={`${progress.toFixed(0)}%`}
          />
          <StatCard label="饱腹度" value={`${pet.satiety} / 100`} extra="越高越活力" />
          <StatCard label="当前积分" value={`${state.player.points}`} extra="去商店消费" />
          <StatCard
            label="背包食物"
            value={`${state.inventory.reduce((sum, item) => sum + item.count, 0)} 份`}
            extra="喂食即可成长"
          />
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ffb55f_0%,#ff7a59_100%)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <QuickLink href="/study" label="去得分" />
          <QuickLink href="/shop" label="去商店" />
          <QuickLink href="/records" label="查看记录" />
          {topFood ? (
            <button
              type="button"
              onClick={() => feed(topFood.type)}
              className="rounded-full bg-orange-100 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-200"
            >
              立刻喂食 {topFood.name}
            </button>
          ) : (
            <QuickLink href="/shop" label="去补货" />
          )}
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            今日提示
          </p>
          <p className="mt-4 text-base leading-8 text-stone-700">
            再完成一次 25 分钟学习，你就几乎可以稳定买下{" "}
            <span className="font-semibold text-stone-900">坚果包</span>。
          </p>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            快速喂食
          </p>
          <div className="mt-4 space-y-3">
            {state.inventory.length ? (
              state.inventory.map((item) => {
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
                        {food.emoji} {food.name} × {item.count}
                      </p>
                      <p className="text-sm text-stone-600">
                        成长 +{food.growth} · 饱腹 +{food.satiety}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => feed(food.type)}
                      className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      喂食
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-stone-600">背包空空的，先去商店买点食物吧。</p>
            )}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            最近升级
          </p>
          <div className="mt-4 space-y-3">
            {state.levelEvents.length ? (
              state.levelEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                  <p className="font-semibold">{event.message}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {new Date(event.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-600">继续学习并喂食，第一次升级很快就会到来。</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  extra,
}: {
  label: string;
  value: string;
  extra: string;
}) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{extra}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
    >
      {label}
    </Link>
  );
}
