"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";
import { FOODS } from "@/lib/game-data";

export default function ShopPage() {
  const { buy, classroom, currentStudent, currentView, restockFood, state } =
    useGame();
  const [restockAmount, setRestockAmount] = useState<Record<string, number>>({
    carrot: 5,
    nuts: 3,
    fish: 2,
  });

  const shopStock = classroom?.shopStock ?? [];

  if (currentView === "teacher") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <PageTitle
            eyebrow="商店库存"
            title="老师负责给班级商店补充商品数量"
            description="学生购买的商品会消耗班级库存。这里由老师统一查看和补货。"
          />

          <div className="space-y-4">
            {FOODS.map((food) => {
              const stock = shopStock.find((item) => item.foodType === food.type)?.stock ?? 0;
              const amount = restockAmount[food.type] ?? 1;

              return (
                <div
                  key={food.type}
                  className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold">
                        {food.emoji} {food.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {food.blurb}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                      库存 {stock}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(event) =>
                        setRestockAmount((prev) => ({
                          ...prev,
                          [food.type]: Number(event.target.value) || 0,
                        }))
                      }
                      className="w-28 rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => restockFood(food.type, amount)}
                      className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                      补货
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            库存说明
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-stone-600">
            <p>1. 班级商店库存是共享的。</p>
            <p>2. 学生购买后，班级库存会自动减少。</p>
            <p>3. 老师可以随时回来补货。</p>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel>
        <PageTitle
          eyebrow="学生商店"
          title={`${currentStudent?.name ?? "当前学生"} 的积分商店`}
          description="学生使用自己的积分购买食物，购买后会消耗班级库存并加入自己的背包。"
        />

        <div className="space-y-4">
          {FOODS.map((food) => {
            const canBuy = state.player.points >= food.price;
            const stock = shopStock.find((item) => item.foodType === food.type)?.stock ?? 0;

            return (
              <div
                key={food.type}
                className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xl font-semibold">
                    {food.emoji} {food.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {food.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-stone-700">
                    <span className="rounded-full bg-white px-3 py-1">
                      {food.price} 积分
                    </span>
                    <span className="rounded-full bg-white px-3 py-1">
                      成长 +{food.growth}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1">
                      库存 {stock}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!canBuy || stock <= 0}
                  onClick={() => buy(food.type)}
                  className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {stock <= 0 ? "缺货" : canBuy ? "购买" : "积分不足"}
                </button>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            当前余额
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-900">
            {state.player.points}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            由老师在“学生加减分”里为你增加或扣除积分。
          </p>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            快速跳转
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/pet"
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
            >
              回到我的动物
            </Link>
            <Link
              href="/inventory"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-800"
            >
              查看背包
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
