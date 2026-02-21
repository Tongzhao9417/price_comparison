# 中转站对比文档站

本项目使用 [Docusaurus](https://docusaurus.io/) 构建为 docs-only 站点，根路径直接展示 Markdown 文档内容。

## 目录结构

- `docs/index.md`: 网站主文档（当前内容来自原始 Markdown）
- `docusaurus.config.js`: 站点配置（docs-only、GitHub Pages 配置）
- `src/css/custom.css`: 轻度自定义主题样式
- `.github/workflows/pages.yml`: GitHub Actions 自动构建与部署

## 本地开发

```bash
pnpm install
pnpm start
```

开发服务器默认启动在 `http://localhost:3000/`。

## 构建

```bash
pnpm build
```

构建产物输出到 `build/`。

## GitHub Pages 部署

工作流已配置为推送 `main` 分支自动部署。

首次启用时需要在仓库设置中确认：

1. `Settings` -> `Pages`
2. `Build and deployment` 选择 `GitHub Actions`

工作流会自动读取 `GITHUB_REPOSITORY` 计算项目站点 `baseUrl`，无需手动写死仓库名。
