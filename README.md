# 🌿 亚健康自测｜交互式问卷（React + Vite + Tailwind）

一键部署到 Vercel 的项目模板。包含自动评分、分维度统计、CSV 导出与打印。

## 本地运行
```bash
npm install
npm run dev
```

访问：`http://localhost:5173`

## 一键部署到 Vercel
1. 新建一个 GitHub 仓库，将本项目代码推送上去；
2. 打开 [vercel.com](https://vercel.com) 并 **Import Project**；
3. Framework 选择 **Vite**（会自动识别）；
4. Build Command: `npm run build`，Output Directory: `dist`（自动识别）；
5. Deploy 完成后即得到一个公网链接。

> 也可直接在 Vercel 中 **New Project → Add Github Repo → Deploy**，无需额外配置。

## 自定义
- 修改 `src/App.jsx` 内容（题库、评分规则、样式）；
- 如果需要品牌化：在页面顶部加入 LOGO、Footer 添加公司信息；
- 想要多人收集与看板：可对接 Supabase / Firebase / Airtable API 进行数据落库。

## License
MIT
