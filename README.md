# CODPL

CODPL 是一个面向多厂商 Coding Plan / Code API 的静态评测站，用来做 Coding Plan 评测、Coding Plan 测速、Code API Benchmark、模型多厂家对比和长期趋势追踪。项目会持续展示不同平台、不同模型的 TTFT、MedianTPS、综合体验分数与历史快照，帮助开发者在接入、采购和选型前先看真实拨测结果。

如果你正在搜索这些内容，这个项目就是为它们准备的：

- Coding Plan 评测
- Coding Plan benchmark
- Coding Plan 测速
- Coding Plan 厂家对比
- Coding Plan 购买参考
- Code API 响应速度对比
- TTFT / MedianTPS / 综合体验排行

## 在线地址

- 主站：<https://codpl.15o.cc>
- 海外节点：<https://bench.codpl.com/>
- 厂家接入状态、购买链接、官方文档入口：<https://bench.codpl.com/providers>

海外节点由 Cloudflare 提供，适合海外网络访问。

## 项目在做什么

- 持续拨测多家 Coding Plan / Code API 厂商，公开展示最近一轮结果。
- 对比首字延迟 TTFT、MedianTPS、综合得分与多厂家同模型表现。
- 通过静态 JSON 快照沉淀历史数据，方便观察 24 小时与 30 天趋势变化。
- 给开发者、团队采购和模型选型提供一个公开、直观、可复查的参考页面。

这个仓库是前端发布仓库，只保留静态站点需要的前端代码与快照数据，不包含后端源码、数据库和私有环境变量。

## 当前拨测覆盖的厂家

当前公开页面已覆盖以下 Coding Plan / Code API 厂家，完整模型清单见 [BENCHMARK_COVERAGE.md](./BENCHMARK_COVERAGE.md)：

- 讯飞星辰：glm-5
- 百炼（阿里云）：Qwen3.5 Plus、glm-5、kimi-k2.5、MiniMax-M2.5
- Kimi（月之暗面）：kimi-k2.6
- MiniMax：minimax-m2.7、MiniMax-M2.5
- 阶跃星辰：step-3.5-flash
- 火山引擎：minimax-m2.5、minimax-m2.7、glm-5.1、deepseek-v3.2、kimi-k2.6、kimi-k2.5
- 智谱：glm-5、GLM-5-Turbo、glm-5.1
- 无问芯穹：deepseek-v3.2、deepseek-v3.2-thinking、glm-4.7、minimax-m2.1、kimi-k2.5、glm-5、glm-5.1、minimax-m2.5、minimax-m2.7
- 腾讯云：Hunyuan 2.0 Instruct、MiniMax-M2.5、kimi-k2.5、glm-5
- 京东云：DeepSeek-V3.2、GLM-5、GLM-4.7、MiniMax-M2.5、Kimi-K2.5
- 优云（ModelVerse）：kimi-k2.5、MiniMax-M2.5、glm-5
- 联通云：MiniMax-M2.5、kimi-k2.5、glm-5
- 联通元景：glm-5、glm-5.1、kimi-k2.6
- 移动云：cm-code-latest
- 百度云（千帆）：deepseek-v3.2、kimi-k2.5、glm-5、minimax-m2.5
- 小米 MiMo：MiMo-V2.5-Pro、MiMo-V2.5
- 快手 StreamLake：KAT-Coder-ProV2
- OpenCode Go：glm-5、glm-5.1、kimi-k2.5、MiMo-V2.5-Pro、MiMo-V2.5、minimax-m2.7、MiniMax-M2.5
- 天翼云：GLM-5、GLM-5-Turbo、GLM-5.1
- Ollama Cloud：deepseek-v3.2、glm-4.7、glm-5、glm-5.1、kimi-k2.6、kimi-k2.5、minimax-m2.1、MiniMax-M2.5、minimax-m2.7
- Alaya Code：MiniMax-M2.5、minimax-m2.1、glm-5、kimi-k2.5

如果你想直接查看厂家接入状态、购买入口、AFF 入口和官方文档入口，建议直接访问：

- <https://bench.codpl.com/providers>

## 仓库包含什么

- 前端源码
- 构建时导入的静态快照：`src/generated/benchmark-data.json`
- 公开静态数据：`public/data/`
- 项目覆盖清单与公开说明文档

不包含：

- Go 后端源码
- SQLite 数据库
- 服务端守护脚本
- 私有环境变量

## 站点架构说明

站点已切换为纯静态部署，不再内置登录、评论和服务端会话；讨论与协作建议放到仓库工作流或外部社区里完成。

**为什么不再内置留言板**

- 静态站点只负责展示构建期生成的结果快照，不再承担运行时写接口。

**提交即留痕**

- 每一轮拨测都会生成新的 JSON 快照并进入 Git 历史，数据变更天然可追溯。

**部署更轻**

- 没有常驻 Go 服务、数据库会话和评论接口，Cloudflare Pages 只需托管静态产物。

**讨论外置**

- 需要交流时，建议放到仓库 Issue / Discussion、触发构建的 PR，或其他外部社区线程中。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

## 相关文档

- 拨测覆盖的全部厂家与模型：[BENCHMARK_COVERAGE.md](./BENCHMARK_COVERAGE.md)
