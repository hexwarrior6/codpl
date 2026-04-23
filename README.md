# CODPL Frontend

CODPL 是一个面向多厂商 Coding Plan / Code API 的静态评测站前端。这个目录是前端源码基准目录，今后发布到 `https://github.com/hloolx/codpl` 时，应直接以这里为准同步，而不是再手工从别的目录拼装。

## 当前数据架构

前端已经不再静态导入整份大 JSON。

当前使用的是：

- 后端把 SQLite 中的数据导出到 `public/data/`
- 首页先加载最小 `bootstrap.json`
- 趋势页按需加载 `history/*.json` 与 `performance/*.json`
- 模型对比页先加载 `models/list.json`，再按模型与窗口加载 `comparisons/{window}/{logicalModelId}.json`

`src/generated/benchmark-data.json` 仍然会保留，但现在只是一个小型 bootstrap 镜像，不再作为前端运行时主数据源。

## 目录说明

- `src/`：前端源码
- `public/data/bootstrap.json`：首页 / 排行榜 / 厂商页首屏基础数据
- `public/data/history/*.json`：短期趋势分片
- `public/data/performance/*.json`：长期趋势分片
- `public/data/models/list.json`：历史模型列表
- `public/data/comparisons/**`：逐模型逐窗口对比分片
- `public/data/snapshots/*.json`：历史快照归档

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

类型检查：

```bash
npm run typecheck
```

生产构建：

```bash
npm run build
```

## 发布同步约定

同步到 `codpl` 发布仓库时，至少要对比这些内容是否一致：

- `src/`
- `public/`
- 根目录配置文件：`package.json`、`package-lock.json`、`vite.config.ts`、`tsconfig.json`、`tailwind.config.ts`、`postcss.config.js`、`index.html`、`.env.example`、`.gitignore`、`components.json`
- `README.md`

如果发布仓库里存在源码目录没有的说明文件或额外文档，不能无脑删掉，先对比内容再决定是否保留。
