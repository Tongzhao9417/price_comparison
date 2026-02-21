# 中转站对比文档站

本项目使用 [Docusaurus](https://docusaurus.io/) 构建为 docs-only 站点，根路径直接展示 Markdown 文档内容。

## 目录结构

- `docs/index.md`: 网站主文档（表格由 XLSX/CSV 自动同步）
- `data/relay_table.xlsx`: 主表格数据源（推荐用 Excel/Numbers 维护）
- `data/relay_table.csv`: 由脚本同步生成的文本快照（便于 diff）
- `scripts/sync_table.py`: 将 XLSX/CSV 同步成首页 Markdown 表格
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

## 维护表格（推荐方式）

不要直接手改 `docs/index.md` 的表格行，优先改 `data/relay_table.xlsx` 后同步即可。

```bash
pnpm table:sync
```

同步脚本会只替换 `docs/index.md` 里 `<!-- relay-table:start -->` 到 `<!-- relay-table:end -->` 的内容。

如果 CSV 在本地打开乱码，直接改 `data/relay_table.xlsx` 即可；脚本会自动生成带 BOM 的 `data/relay_table.csv` 供 diff 使用。

改表头请直接改 `data/relay_table.xlsx` 第一行。

### XLSX 列说明（第一行就是表头，会同步到网站）

- 第 1 行：表头（会原样同步到 Markdown）
- 第 2 行起：数据行
- 列数不固定：你可以自由新增/删除列，脚本会按第一行表头自动生成整张表
- 单元格可直接写 Markdown，例如链接 `[...] (...)`、换行 `<br />`
