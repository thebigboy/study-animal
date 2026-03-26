"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/game-provider";
import { Panel, PageTitle } from "@/components/ui";
import { ANIMALS } from "@/lib/game-data";
import { AnimalType } from "@/types/game";

export default function AdoptPage() {
  const router = useRouter();
  const { classroom, currentStudent, state, adopt } = useGame();
  const [selected, setSelected] = useState<AnimalType>("hamster");
  const [petName, setPetName] = useState("");

  const alreadyAdopted = Boolean(state.pet);

  const preview = useMemo(
    () => ANIMALS.find((animal) => animal.type === selected),
    [selected],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {!currentStudent ? (
        <Panel className="lg:col-span-2">
          <PageTitle
            eyebrow="认领前置"
            title="先创建班级并选择一位学生"
            description="班级模式下，认领行为归属于当前学生。先在班级页添加学生，再回来认领。"
          />
          <button
            type="button"
            onClick={() => router.push("/classroom")}
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            前往班级页
          </button>
        </Panel>
      ) : null}

      <Panel>
        <PageTitle
          eyebrow="认领"
          title={`为 ${currentStudent?.name ?? "当前学生"} 选择学习伙伴`}
          description={`班级：${classroom?.className ?? "未创建"}。每位学生只能维护自己的宠物存档。`}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {ANIMALS.map((animal) => {
            const active = selected === animal.type;
            return (
              <button
                key={animal.type}
                type="button"
                onClick={() => setSelected(animal.type)}
                className={`rounded-[24px] border p-4 text-left transition ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-stone-50 hover:border-stone-300"
                }`}
              >
                <div className="text-5xl">{animal.emoji}</div>
                <p className="mt-3 text-lg font-semibold">{animal.name}</p>
                <p className={`mt-1 text-sm ${active ? "text-orange-200" : "text-orange-500"}`}>
                  {animal.title}
                </p>
                <p className={`mt-3 text-sm leading-6 ${active ? "text-white/80" : "text-stone-600"}`}>
                  {animal.motto}
                </p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <PageTitle
          eyebrow="命名"
          title={alreadyAdopted ? "你已经成功认领过啦" : "给它起一个名字"}
          description="名字会展示在主页欢迎语、升级提示和学习反馈里。"
        />

        <div className="rounded-[28px] bg-stone-50 p-5">
          <div className="text-7xl">{preview?.emoji}</div>
          <p className="mt-4 text-xl font-semibold">{preview?.name}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {preview?.motto}
          </p>
        </div>

        <label className="mt-5 block text-sm font-medium text-stone-700">
          伙伴名字
        </label>
        <input
          value={petName}
          onChange={(event) => setPetName(event.target.value)}
          placeholder="比如：团团 / 阿冰 / 小火苗"
          className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
        />

        <button
          type="button"
          disabled={alreadyAdopted || !currentStudent}
          onClick={() => {
            adopt(selected, petName);
            router.push("/pet");
          }}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {alreadyAdopted ? "已认领，前往小窝" : "确认认领并进入小窝"}
        </button>

        {alreadyAdopted ? (
          <button
            type="button"
            onClick={() => router.push("/pet")}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-200"
          >
            查看当前伙伴
          </button>
        ) : null}
      </Panel>
    </div>
  );
}
