"use client";

import { useGame } from "@/components/game-provider";
import { Panel, PageTitle, PrimaryLink, SecondaryLink } from "@/components/ui";
import { ANIMALS, FOODS } from "@/lib/game-data";

export default function HomePage() {
  const { classroom, currentStudent, enterDemoMode, enterLiveMode, mode } =
    useGame();
  const needsOnboarding = !classroom;
  const needsTeacherConfirm = classroom && !classroom.teacherConfirmed;

  if (!mode) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <PageTitle
            eyebrow="模式选择"
            title="请选择进入演示模式，或正式开始录入。"
            description="演示模式会自动生成 50 个学生、5 位老师和一套可直接体验的班级数据；正式模式则从空班级开始，由你自己录入。"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={enterDemoMode}
              className="rounded-[28px] border border-orange-200 bg-orange-50 p-6 text-left transition hover:border-orange-300"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
                演示模式
              </p>
              <h3 className="mt-3 text-2xl font-semibold">预置 50 个学生 + 5 位老师</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                适合演示流程、试用功能和查看仪表盘效果。
              </p>
            </button>

            <button
              type="button"
              onClick={enterLiveMode}
              className="rounded-[28px] border border-stone-200 bg-stone-50 p-6 text-left transition hover:border-stone-300"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                正式模式
              </p>
              <h3 className="mt-3 text-2xl font-semibold">从空班级开始录入</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                适合真实使用，先创建班级，再录入老师和学生信息。
              </p>
            </button>
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            说明
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
            <li>1. 演示模式支持老师身份切换与演示数据浏览。</li>
            <li>2. 正式模式中可自行创建班级、老师和学生。</li>
            <li>3. 右下角按钮可随时回到初始状态。</li>
          </ol>
        </Panel>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Panel className="overflow-hidden">
        <PageTitle
          eyebrow="MVP 原型"
          title={
            needsOnboarding
              ? "先创建班级，再开始认领小动物。"
              : needsTeacherConfirm
                ? `班级已创建，接下来确认您是 ${classroom.teacherName ?? "老师"}。`
                : "老师可以切换学生，查看和喂养他们的学习伙伴。"
          }
          description="这是一个班级版学习养成原型：老师先建立班级并确认身份，再添加学生；学生被切换后即可认领自己的动物。"
        />

        <div className="mb-6 rounded-[24px] bg-orange-50 p-4 text-sm leading-7 text-stone-700">
          当前班级：<span className="font-semibold">{classroom?.className ?? "未创建"}</span>
          {" · "}
          当前学生：<span className="font-semibold">{currentStudent?.name ?? "未选择"}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ANIMALS.map((animal) => (
            <div
              key={animal.type}
              className="rounded-[24px] border border-stone-200 bg-stone-50 p-4"
            >
              <div className="text-5xl">{animal.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{animal.name}</h3>
              <p className="mt-1 text-sm text-orange-500">{animal.title}</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {animal.motto}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryLink
            href={
              needsOnboarding || needsTeacherConfirm || !currentStudent
                ? "/classroom"
                : "/adopt"
            }
          >
            {needsOnboarding
              ? "先创建班级"
              : needsTeacherConfirm
                ? "确认老师身份"
                : currentStudent
                  ? "为当前学生认领"
                  : "去选择学生"}
          </PrimaryLink>
          <SecondaryLink
            href={
              needsOnboarding || needsTeacherConfirm || !currentStudent
                ? "/classroom"
                : "/pet"
            }
          >
            {currentStudent ? "查看学生的小窝" : "前往班级管理"}
          </SecondaryLink>
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            核心闭环
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
            <li>1. 老师创建班级并确认身份</li>
            <li>2. 添加学生并切换当前学生</li>
            <li>3. 学生认领一只学习伙伴并起名字</li>
            <li>4. 老师为学生批量加分或减分</li>
            <li>5. 学生查看动物并喂食成长</li>
          </ol>
        </Panel>

        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            食物商店
          </p>
          <div className="mt-4 space-y-3">
            {FOODS.map((food) => (
              <div
                key={food.type}
                className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">
                    {food.emoji} {food.name}
                  </p>
                  <p className="text-sm text-stone-600">
                    {food.price} 积分 · 成长 +{food.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
