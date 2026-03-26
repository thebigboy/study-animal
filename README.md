# 学习认领小动物

一个基于 `Next.js 16 + Tailwind CSS` 的网页小游戏原型：先认领一只小动物，为它起名，再通过学习获得积分，去商店购买食物并喂养升级。

## 已实现的 MVP

- 班级模式：创建班级、添加学生、切换当前学生
- 首页、认领页、动物主页
- 学习结算（25 / 45 分钟）
- 商店购买食物
- 背包喂食
- 成长值与升级
- 学习记录与积分流水
- `LocalStorage` 本地存档

## 数据持久化

- 当前原型已持久化到浏览器 `LocalStorage`
- 存储键为 `study-animal-classroom-state`
- 班级信息、学生列表、当前学生、每位学生的宠物/积分/背包/记录都会在刷新后保留

## 本地启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 构建校验

```bash
npm run lint
npm run build
```

## 主要目录

- `/Users/wangzhen/code/ai/study-animal/src/app`：页面路由
- `/Users/wangzhen/code/ai/study-animal/src/components`：页面外壳与状态提供者
- `/Users/wangzhen/code/ai/study-animal/src/lib`：游戏规则、常量与计算逻辑
- `/Users/wangzhen/code/ai/study-animal/src/types`：核心类型
- `/Users/wangzhen/code/ai/study-animal/docs/game-design.md`：完整产品设计
- `/Users/wangzhen/code/ai/study-animal/docs/mvp-spec.md`：MVP 功能规格

## 设计文档

- `/Users/wangzhen/code/ai/study-animal/docs/game-design.md`
- `/Users/wangzhen/code/ai/study-animal/docs/user-flow.md`
- `/Users/wangzhen/code/ai/study-animal/docs/wireframes.md`
- `/Users/wangzhen/code/ai/study-animal/docs/mvp-spec.md`
