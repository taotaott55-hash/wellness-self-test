import React, { useMemo, useState } from "react";

const sections = [
  {
    key: "psych",
    title: "一、心理与情绪状态",
    items: [
      "容易焦虑、烦躁或情绪波动大",
      "经常感到无精打采、提不起兴趣",
      "注意力难以集中、记忆力减退",
      "睡眠质量差（难入睡、易醒、多梦）",
      "压力大时出现心慌/发抖等躯体反应",
      "对工作或生活缺乏热情",
      "时常感到孤独、无助或被忽视",
      "对未来没有信心或感到迷茫",
      "经常叹气或莫名发愁",
      "情绪变化影响食欲或睡眠",
    ],
  },
  {
    key: "body",
    title: "二、身体状况",
    items: [
      "经常感到疲倦或乏力",
      "起床后仍觉得没休息好",
      "容易感冒/口腔溃疡/过敏",
      "头痛、头晕或眼睛干涩",
      "胃口不好、腹胀、便秘或腹泻",
      "肌肉酸痛、颈肩僵硬",
      "手脚冰冷或出汗异常",
      "心慌、胸闷或偶有血压不稳",
      "脱发、皮肤暗沉、易长痘",
      "体重忽增忽减、代谢紊乱",
    ],
  },
  {
    key: "life",
    title: "三、生活方式与行为习惯",
    items: [
      "经常熬夜或睡眠不足",
      "久坐不动、运动量少",
      "饮食不规律/常外卖/重口味",
      "依赖咖啡因/甜食/酒精提神",
      "长时间使用手机或电脑",
      "缺乏户外活动和阳光",
      "社交减少、情绪封闭",
      "压力长期得不到释放",
      "缺乏兴趣爱好或放松方式",
      "无规律体检或忽视身体信号",
    ],
  },
];

const MAX_SCORE_PER_ITEM = 5;

function scoreLevel(total) {
  if (total <= 30) return { level: "健康状态良好", color: "bg-emerald-500", advice: [
    "保持规律作息与均衡饮食",
    "每周 3-5 次中等强度运动",
    "维持积极社交与情绪管理",
  ]};
  if (total <= 60) return { level: "轻度亚健康", color: "bg-lime-500", advice: [
    "优化睡眠（固定上/下床时间）",
    "增加力量+有氧结合的运动",
    "减少精制糖/酒精与熬夜",
  ]};
  if (total <= 90) return { level: "中度亚健康", color: "bg-amber-500", advice: [
    "建立 4 周调理计划（作息-饮食-运动-情绪）",
    "必要时补充营养并记录每日能量/情绪波动",
    "引入冥想/呼吸放松 10-15 分钟/天",
  ]};
  return { level: "重度亚健康", color: "bg-rose-500", advice: [
    "尽快系统评估，必要时就医或咨询心理师",
    "制定个性化干预计划并每周复盘",
    "减少高压任务，优先恢复睡眠与基础体力",
  ]};
}

export default function App() {
  const [answers, setAnswers] = useState(() => {
    const init = {};
    sections.forEach((s) => {
      s.items.forEach((_, qi) => {
        init[`${s.key}-${qi}`] = 0;
      });
    });
    return init;
  });

  const [showAdvice, setShowAdvice] = useState(true);

  const totals = useMemo(() => {
    const bySection = {};
    let total = 0;
    sections.forEach((s) => {
      const sum = s.items.reduce((acc, _it, qi) => acc + (answers[`${s.key}-${qi}`] || 0), 0);
      bySection[s.key] = sum;
      total += sum;
    });
    return { bySection, total };
  }, [answers]);

  const maxTotals = useMemo(() => {
    const bySection = {};
    let total = 0;
    sections.forEach((s) => {
      const max = s.items.length * MAX_SCORE_PER_ITEM;
      bySection[s.key] = max;
      total += max;
    });
    return { bySection, total };
  }, []);

  const completion = useMemo(() => {
    const vals = Object.values(answers);
    const filled = vals.filter((v) => v > 0).length;
    const all = vals.length;
    return Math.round((filled / all) * 100);
  }, [answers]);

  const level = scoreLevel(totals.total);

  const handleSelect = (key, val) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const resetAll = () => {
    const cleared = { ...answers };
    Object.keys(cleared).forEach((k) => (cleared[k] = 0));
    setAnswers(cleared);
  };

  const exportCSV = () => {
    const rows = [["维度", "题目", "分数"]];
    sections.forEach((s) => {
      s.items.forEach((item, qi) => {
        rows.push([s.title, item, String(answers[`${s.key}-${qi}`] || 0)]);
      });
    });
    rows.push(["总分", "—", String(totals.total)]);
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().slice(0, 10);
    a.download = `亚健康自测_${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPage = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🌿 亚健康自测｜交互式问卷</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">1～5 分量表（1=几乎没有，5=经常或严重）。打分即时统计，生成结果解读与调理建议。</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={exportCSV} className="rounded-2xl px-3 py-2 text-sm font-medium bg-white shadow hover:shadow-md border">导出CSV</button>
            <button onClick={printPage} className="rounded-2xl px-3 py-2 text-sm font-medium bg-white shadow hover:shadow-md border">打印</button>
            <button onClick={resetAll} className="rounded-2xl px-3 py-2 text-sm font-medium bg-white shadow hover:shadow-md border">重置</button>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">作答进度</span>
              <span className="text-sm font-semibold">{completion}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {sections.map((s) => {
                const filled = s.items.filter((_, qi) => (answers[`${s.key}-${qi}`] || 0) > 0).length;
                const pct = Math.round((filled / s.items.length) * 100);
                return (
                  <div key={s.key} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between"><span className="font-medium">{s.title.replace(/^[一二三]、/, '')}</span><span>{pct}%</span></div>
                    <div className="mt-2 h-2 w-full rounded bg-gray-100"><div className="h-2 rounded bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">当前总分</div>
            <div className="mt-1 text-3xl font-bold">{totals.total} <span className="text-base font-normal text-gray-500">/ {maxTotals.total}</span></div>
            <div className="mt-3 text-sm text-gray-700">状态：<span className={`inline-block rounded-full px-2 py-0.5 text-white ${level.color}`}>{level.level}</span></div>
            <details className="mt-3 text-sm text-gray-600">
              <summary className="cursor-pointer select-none">分维度得分</summary>
              <ul className="mt-2 space-y-1">
                {sections.map((s) => (
                  <li key={s.key} className="flex items-center justify-between"><span>{s.title.replace(/^[一二三]、/, '')}</span><span className="font-semibold">{totals.bySection[s.key]} / {maxTotals.bySection[s.key]}</span></li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <SectionBlock
              key={section.key}
              section={section}
              answers={answers}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">结果解读与调理建议</h2>
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <input type="checkbox" checked={showAdvice} onChange={(e) => setShowAdvice(e.target.checked)} /> 显示建议
            </label>
          </div>

          <div className="mt-3 text-sm text-gray-700">
            <p>根据总分判定：<span className={`inline-block rounded-full px-2 py-0.5 text-white ${level.color}`}>{level.level}</span></p>
            {showAdvice && (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {level.advice.map((tip, idx) => (
                  <li key={idx} className="rounded-xl border p-3 bg-gray-50">✅ {tip}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            * 本工具为健康自我管理参考，不替代临床诊断。如症状持续或影响功能，请寻求专业医生/心理咨询师帮助。
          </div>
        </div>

        <footer className="mt-10 pb-6 text-center text-xs text-gray-500">
          Made with ❤️ for daily wellbeing tracking · 可打印/导出留存
        </footer>
      </div>
    </div>
  );
}

function SectionBlock({ section, answers, onSelect }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{section.title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="w-[56%] py-2 pr-4">题目</th>
              <th className="py-2 pr-2">1</th>
              <th className="py-2 pr-2">2</th>
              <th className="py-2 pr-2">3</th>
              <th className="py-2 pr-2">4</th>
              <th className="py-2 pr-2">5</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((q, qi) => {
              const key = `${section.key}-${qi}`;
              const val = answers[key] || 0;
              return (
                <tr key={key} className="border-t">
                  <td className="py-2 pr-4 align-top">
                    <div className="max-w-prose text-gray-800">{qi + 1}. {q}</div>
                    <div className="mt-1 text-[11px] text-gray-400">1=几乎没有 · 3=偶尔/中等 · 5=经常/严重</div>
                  </td>
                  {[1,2,3,4,5].map((score) => (
                    <td key={score} className="py-2 pr-2">
                      <label className="inline-flex items-center justify-center">
                        <input
                          type="radio"
                          name={key}
                          className="h-4 w-4 accent-emerald-600"
                          checked={val === score}
                          onChange={() => onSelect(key, score)}
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
