import { useEffect, useState } from "react";

import CardSwap, { Card } from "./components/CardSwap.jsx";
import ChromaGrid from "./components/ChromaGrid.jsx";
import CircularGallery from "./components/CircularGallery.jsx";
import ElectricBorder from "./components/ElectricBorder.jsx";
import GradientText from "./components/GradientText.jsx";
import LiquidEther from "./components/LiquidEther.jsx";
import SpotlightCard from "./components/SpotlightCard.jsx";
import TargetCursor from "./components/TargetCursor.jsx";
import TextType from "./components/TextType.jsx";
import Threads from "./components/Threads.jsx";

import portraitHero from "../assets/portrait-hero.png";
import heroPhoto2 from "../assets/hero-photo-2.jpg";
import heroPhoto3 from "../assets/hero-photo-3.jpg";
import sorImage from "../assets/case-sor-agent.png";
import platformImage from "../assets/case-enterprise-platform.png";
import campusImage from "../assets/case-campus-rag.png";
import certificateUrl from "../assets/large-model-certificate.png";
import dailyBriefScreenshot from "../assets/lab-screenshots/dailybrief-agent.png";
import dailyBriefScreenshot2 from "../assets/lab-screenshots/dailybrief-agent-2.png";
import dailyBriefScreenshot3 from "../assets/lab-screenshots/dailybrief-agent-3.png";
import localPdfScreenshot from "../assets/lab-screenshots/local-pdf-chat-rag.png";
import localPdfScreenshot2 from "../assets/lab-screenshots/local-pdf-chat-rag-2.png";
import personalKnowledgeScreenshot from "../assets/lab-screenshots/personal-knowledge-agent.png";
import personalKnowledgeScreenshot2 from "../assets/lab-screenshots/personal-knowledge-agent-2.png";
import personalKnowledgeScreenshot3 from "../assets/lab-screenshots/personal-knowledge-agent-3.png";
import personalKnowledgeScreenshot4 from "../assets/lab-screenshots/personal-knowledge-agent-4.png";
import prdSkillScreenshot from "../assets/lab-screenshots/prd-skill.png";

const navItems = [
  ["信息", "#profile"],
  ["能力", "#map"],
  ["案例", "#cases"],
  ["评测", "#evaluation"],
  ["AI Lab", "#lab"],
  ["联系", "#contact"],
];

const abilities = [
  {
    index: "01",
    title: "复杂业务场景诊断",
    description: "从 SOR 需求拆解、企业代码查询、自动走查报告和校园迎新场景中定位 AI 产品机会。",
    tags: "业务痛点 / 用户旅程 / 输入输出定义",
  },
  {
    index: "02",
    title: "AI 产品方案与 PRD 交付",
    description: "熟练撰写 PRD、竞品分析和业务流程图，用原型工具把方案表达清楚。",
    tags: "PRD / Figma / Axure / XMind / Visio",
  },
  {
    index: "03",
    title: "Agent / RAG 工作流产品化",
    description: "把 LangGraph、AutoGen、RAG、MCP、VLM 等技术能力翻译成可交付的产品流程。",
    tags: "LangGraph / AutoGen / RAG / MCP",
  },
  {
    index: "04",
    title: "模型评测与可靠性迭代",
    description: "围绕准确率、召回率、F1-Score、答案一致性和 Bad Case 持续迭代模型表现。",
    tags: "准确率 / 召回率 / F1 / Bad Case",
  },
  {
    index: "05",
    title: "PoC 与原型快速构建",
    description: "熟练运用 Codex、Cursor、Claude Code、Trae 等 AI 编码工具快速构建产品原型。",
    tags: "Codex / Cursor / Claude Code / Trae",
  },
];

const escapeSvg = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const wrapText = (text, maxLength) => {
  const chars = Array.from(text);
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    if (/[、。，；：,.!?]/.test(char)) {
      line += char;
      return;
    }
    const weight = /[A-Za-z0-9/ .-]/.test(char) ? 0.55 : 1;
    const length = Array.from(line).reduce((sum, item) => sum + (/[A-Za-z0-9/ .-]/.test(item) ? 0.55 : 1), 0);
    if (length + weight > maxLength && line) {
      lines.push(line.trim());
      line = char;
    } else {
      line += char;
    }
  });
  if (line) lines.push(line.trim());
  return lines;
};

const abilityCardColors = ["#eef6ff", "#f0f8f2", "#fff5eb", "#f5f0ff", "#eef8f8"];

const createAbilityCardImage = ({ description, index, tags, title }, itemIndex) => {
  const descriptionLines = wrapText(description, 16).slice(0, 4);
  const tagLines = wrapText(tags, 22).slice(0, 2);
  const fill = abilityCardColors[itemIndex % abilityCardColors.length];
  const descriptionMarkup = descriptionLines
    .map((line, lineIndex) => `<tspan x="58" dy="${lineIndex === 0 ? 0 : 54}">${escapeSvg(line)}</tspan>`)
    .join("");
  const tagMarkup = tagLines
    .map((line, lineIndex) => `<tspan x="58" dy="${lineIndex === 0 ? 0 : 39}">${escapeSvg(line)}</tspan>`)
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
      <style>
        .index { fill: #7c7e83; font: 700 32px Inter, 'Microsoft YaHei', sans-serif; }
        .title { fill: #171718; font: 700 50px Inter, 'Microsoft YaHei', sans-serif; }
        .desc { fill: #25282b; font: 500 36px Inter, 'Microsoft YaHei', sans-serif; }
        .tags { fill: #171718; font: 650 29px Inter, 'Microsoft YaHei', sans-serif; }
      </style>
      <rect width="720" height="900" rx="46" fill="${fill}"/>
      <rect x="24" y="24" width="672" height="852" rx="42" fill="rgba(255,255,255,0.72)" stroke="#d8dfe8" stroke-width="2"/>
      <rect x="58" y="608" width="604" height="162" rx="28" fill="rgba(255,255,255,0.58)"/>
      <text class="index" x="58" y="102">${escapeSvg(index)}</text>
      <text class="title" x="58" y="222">${escapeSvg(title)}</text>
      <text class="desc" x="58" y="342">${descriptionMarkup}</text>
      <line x1="58" y1="570" x2="662" y2="570" stroke="#d8dbe0" stroke-width="2"/>
      <text class="tags" x="58" y="670">${tagMarkup}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const abilityGalleryItems = abilities.map((item, index) => ({
  image: createAbilityCardImage(item, index),
  text: item.title,
}));

const cases = [
  {
    id: "sor",
    tab: "SOR 拆解 Agent",
    label: "SOR Agent",
    eyebrow: "CASE 01",
    title: "SOR 需求规格文档拆解 Agent",
    image: sorImage,
    chroma: "#f18f73",
    description:
      "在轻舟智航实习期间，针对 SOR 需求规格文档人工拆解成本高、极度依赖人工比对的问题，从 0 到 1 设计并落地面向技术规格文档的 AI 需求拆解 Agent。",
    bullets: [
      "主导业务流程梳理与 PRD 撰写，设计 HITL 人机协同机制，明确 Agent 边界、人工复核节点和验收标准。",
      "基于 LangGraph 设计条件分支、状态管理与循环纠错工作流，并持续迭代关键节点 Prompt，提升复杂文档解析稳定性。",
      "制定“飞书 Aily 问答检索 + 并发控制 + 缓冲池 + VLM 兜底”策略，辅助业务团队将需求分析和人工复核效率提升 900% 以上。",
    ],
    proof: ["从 0 到 1", "HITL", "LangGraph", "效率提升 900%+"],
  },
  {
    id: "platform",
    tab: "企业 AI 提效平台",
    label: "AI Tools Platform",
    eyebrow: "CASE 02",
    title: "企业 AI 提效工具平台",
    image: platformImage,
    chroma: "#298ef5",
    description:
      "参与设计企业级 AI 提效工具平台，解决内部 AI 工具分散、复用率低的问题，统一接入代码查询与自动走查报告生成能力。",
    bullets: [
      "主导梳理“飞书交互层 - Agent 执行层 - MCP 能力层”的整体产品架构，实现多类 AI 工具统一接入与分发。",
      "推动接入 GitLab MCP Server，让非研发角色用自然语言查询代码，降低跨团队沟通成本。",
      "设计自动化报告生成流程，统一格式并实现原子报告、对比报告和走查记录的自动校验生成。",
    ],
    proof: ["飞书交互层", "Agent 执行层", "MCP 能力层", "自动报告"],
  },
  {
    id: "campus",
    tab: "校园迎新 RAG 智能体",
    label: "Campus RAG",
    eyebrow: "CASE 03",
    title: "校园迎新 RAG 智能体",
    image: campusImage,
    chroma: "#6b8f4f",
    description:
      "作为项目负责人/核心设计者，针对校园迎新信息分散、网络设备运维协作不足等痛点，设计并落地垂直领域咨询 Agent 与网络终端管理系统，获得全国二等奖。",
    bullets: [
      "负责 RAG 链路策略定义，跑通“解析 - 分块 - 混合检索 - 生成”的核心问答流程。",
      "引入敏感词库与双向审查机制，建立安全边界与效果评估机制，降低幻觉和越界风险。",
      "引入 MCP 协议架构，打通哑终端数据孤岛，实现设备在线监控与核心指标自动化总结。",
    ],
    proof: ["项目负责人", "RAG 策略", "MCP 协议", "全国二等奖"],
  },
];

const evaluationProjects = [
  {
    title: "企业代码查询 Agent 测评",
    description:
      "面向企业代码查询场景，构建覆盖行车/泊车业务的专业测评集，用普通、开放和诱导性问题验证 Agent 的稳定检索与抗幻觉能力。",
    tags: ["普通问题", "开放问题", "诱导性问题", "准确率", "召回率", "F1-Score", "答案一致性"],
    highlights: [
      "制定覆盖准确率、召回率、F1-Score 与答案一致性的多维 PM 评估标准。",
      "通过深挖“浅层检索”“场景不明确”等 Bad Case，逆向迭代系统提示词和问题定义。",
      "最终将核心模型抗幻觉准确率从 66.67% 提升到 92.86%，回答一致性从 61.90% 提升到 88.10%。",
    ],
    badCases: ["浅层检索", "场景不明确", "诱导性问题", "分支定位偏差", "答案不一致"],
  },
  {
    title: "校园迎新 RAG 智能体测评",
    description:
      "围绕迎新咨询与网络终端管理场景，定义 RAG 链路的安全边界、召回质量和答案可用性评估机制，确保回答可控、可追溯。",
    tags: ["RAG", "混合检索", "敏感词库", "双向审查", "安全边界", "效果评估"],
    highlights: [
      "负责“解析 - 分块 - 混合检索 - 生成”链路策略定义，保证知识召回和回答生成路径清晰。",
      "引入敏感词库与双向审查机制，为校园咨询类 Agent 建立可解释的安全边界。",
      "通过 MCP 协议打通终端管理数据，扩展从问答咨询到设备监控和指标总结的产品能力。",
    ],
    badCases: ["信息分散", "召回遗漏", "越界回答", "幻觉风险", "终端数据孤岛"],
  },
];

const labItems = [
  {
    title: "个人知识库 Agent",
    position: "面向高频收藏但低消化率的个人学习者，解决“稍后阅读变成永不阅读”的问题。",
    description:
      "设计并落地“飞书对话入口 + Agent 意图识别 + Notion 知识库 + 状态流转 + Obsidian 本地知识图谱 + 定时提醒”的知识管理闭环。",
    tags: ["Feishu Bot", "Agent 意图识别", "Notion API", "Obsidian", "状态流转", "知识图谱", "定时提醒"],
    screenshots: [
      personalKnowledgeScreenshot,
      personalKnowledgeScreenshot2,
      personalKnowledgeScreenshot3,
      personalKnowledgeScreenshot4,
    ],
  },
  {
    title: "本地 PDF Chat RAG 智能体",
    position: "面向企业/垂直场景长文档检索难、资产沉淀利用率低和隐私安全要求高的问题。",
    description:
      "设计并落地“高效解析 - 混合检索 - 双模生成 - 精准溯源”的双模 RAG 智能问答系统，兼顾云端高质量回答与本地隐私合规。",
    tags: ["RAG", "DeepSeek-R1", "Ollama", "FAISS", "BM25", "FastAPI", "流式问答", "精准溯源"],
    screenshots: [localPdfScreenshot, localPdfScreenshot2],
  },
  {
    title: "DailyBrief 每日简报 Agent",
    position: "一个每天主动推送信息摘要的 Agent，用来降低多信息源环境下的主动筛选成本。",
    description:
      "聚合 AI 前沿、科技动态、财经市场、国际时政和中文社区内容，再交给 LLM 摘要、筛选、重组并推送到飞书或网页报告。",
    tags: ["Daily Brief", "RSS", "GitHub Actions", "Feishu", "LLM Summary", "TypeScript", "信息聚合"],
    screenshots: [dailyBriefScreenshot, dailyBriefScreenshot2, dailyBriefScreenshot3],
  },
  {
    title: "PRD 书写 Skill",
    position: "一个用于产品需求文档写作的 Skill，把模糊想法推进成可讨论、可执行、可开发的产品方案。",
    description:
      "帮助梳理目标用户、使用场景、核心问题、功能边界、数据结构、交互流程、验收标准和迭代计划。",
    tags: ["PRD", "产品设计", "需求分析", "功能拆解", "验收标准"],
    screenshots: [prdSkillScreenshot],
  },
  {
    title: "论文与科研工作流 Skill 体系",
    position: "围绕科研场景沉淀的一组 Skill，让 AI 参与调研、思考、表达和呈现的完整链路。",
    description:
      "包括论文进展记录、论文调研、论文写作润色和论文配图生成，用于整理相关工作、研究空白、实验进展和论文表达。",
    tags: ["Paper Research", "Academic Writing", "Literature Review", "Research Progress", "Paper Figure"],
  },
];

const awards = [
  ["Scholarship", "同济大学校级奖学金"],
  ["National Prize", "基于大模型教育管理应用创新赛全国二等奖"],
  ["Language", "英语CET6证书"],
  ["Research", "发表两篇中文核心期刊"],
];

function SectionHead({ eyebrow, title, meta, controls = true, gradient = true }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{gradient ? <GradientText>{title}</GradientText> : title}</h2>
      </div>
      {controls && (
        <div className="section-controls" aria-hidden="true">
          <span>{meta}</span>
          <button type="button">‹</button>
          <button type="button">›</button>
        </div>
      )}
    </div>
  );
}

function ThreadsBackground() {
  return <Threads className="section-threads" />;
}

function ScreenshotModal({ modal, onClose, onNext, onPrevious }) {
  if (!modal) return null;

  const { eyebrow = "SCREENSHOT", images, index, title } = modal;
  const canBrowse = images.length > 1;

  return (
    <div className="screenshot-modal" role="dialog" aria-modal="true" aria-label={`${title} 截图预览`}>
      <div className="modal-backdrop" aria-hidden="true" onClick={onClose} />
      <div className="modal-panel">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h3>{title}</h3>
          </div>
          <button className="modal-close" type="button" aria-label="关闭截图预览" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-image-stage">
          {canBrowse && (
            <button className="modal-arrow modal-arrow-left" type="button" aria-label="上一张截图" onClick={onPrevious}>
              ‹
            </button>
          )}
          <img src={images[index]} alt={`${title} 截图 ${index + 1}`} />
          {canBrowse && (
            <button className="modal-arrow modal-arrow-right" type="button" aria-label="下一张截图" onClick={onNext}>
              ›
            </button>
          )}
        </div>

        <div className="modal-foot">
          <span>
            {index + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const getInitialCaseId = () => {
    return "sor";
  };

  const [activeCaseId, setActiveCaseId] = useState(getInitialCaseId);
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const activeCase = cases.find((item) => item.id === activeCaseId) ?? cases[0];
  const activeLabItem = labItems[activeLabIndex];
  const [screenshotModal, setScreenshotModal] = useState(null);

  const selectCase = (id) => {
    setActiveCaseId(id);
  };

  useEffect(() => {
    const syncCaseFromHash = () => {
      const id = window.location.hash.replace("#case-", "");
      if (cases.some((item) => item.id === id)) {
        window.requestAnimationFrame(() => {
          document.getElementById(`case-${id}`)?.scrollIntoView();
        });
      }
    };

    syncCaseFromHash();
    window.addEventListener("hashchange", syncCaseFromHash);

    return () => {
      window.removeEventListener("hashchange", syncCaseFromHash);
    };
  }, []);

  const closeScreenshotModal = () => setScreenshotModal(null);
  const showPreviousScreenshot = () => {
    setScreenshotModal((current) =>
      current
        ? {
            ...current,
            index: (current.index - 1 + current.images.length) % current.images.length,
          }
        : current,
    );
  };
  const showNextScreenshot = () => {
    setScreenshotModal((current) =>
      current
        ? {
            ...current,
            index: (current.index + 1) % current.images.length,
          }
        : current,
    );
  };

  useEffect(() => {
    if (!screenshotModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeScreenshotModal();
      if (event.key === "ArrowLeft") showPreviousScreenshot();
      if (event.key === "ArrowRight") showNextScreenshot();
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [screenshotModal]);

  return (
    <>
      <header className="topbar" aria-label="主导航">
        <nav className="nav-shell">
          <a className="brand" href="#hero" aria-label="回到首页">
            GONG JIAHAO
          </a>
          <div className="nav-links" aria-label="页面章节">
            {navItems.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <span>AI PM Portfolio</span>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="hero">
          <LiquidEther />
          <div className="hero-wordmark" aria-hidden="true">
            AI PRODUCT MANAGER
          </div>
          <div className="hero-shell" id="profile">
            <div className="hero-copy">
              <p className="eyebrow">AI PRODUCT MANAGER PORTFOLIO</p>
              <h1>龚佳豪</h1>
              <p className="hero-intent">求职意向：AI 产品经理</p>
              <p className="hero-lead">
                拥有轻舟智航 AI 产品实习经历，聚焦 Agent、RAG、MCP 与企业提效工具，把复杂业务场景拆成可交付、可评测、可迭代的 AI 产品方案。
              </p>
              <div className="hero-contact" aria-label="联系方式">
                <a href="tel:18474447573">18474447573</a>
                <a href="mailto:2432265@tongji.edu.cn">2432265@tongji.edu.cn</a>
              </div>
              <div className="education-list" aria-label="教育经历">
                <div>
                  <span>2024.09 - 至今</span>
                  <em>985</em>
                  <strong>同济大学 电子信息 硕士</strong>
                </div>
                <div>
                  <span>2019.09 - 2023.06</span>
                  <em>211</em>
                  <strong>江南大学 土木工程 本科</strong>
                </div>
              </div>
              <div className="tag-row" aria-label="核心标签">
                {["AI 产品经理", "Agent", "RAG", "MCP", "PRD", "模型评测", "PoC 原型"].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="hero-card-stage" aria-label="首屏卡片交换展示">
              <CardSwap>
                <Card customClass="swap-photo-card">
                  <img src={portraitHero} alt="龚佳豪高清照片" />
                </Card>
                <Card customClass="swap-photo-card">
                  <img src={heroPhoto2} alt="龚佳豪个人照片 2" />
                </Card>
                <Card customClass="swap-photo-card">
                  <img src={heroPhoto3} alt="龚佳豪个人照片 3" />
                </Card>
              </CardSwap>
            </div>
          </div>
        </section>

        <section className="section" id="map">
          <ThreadsBackground />
          <SectionHead
            eyebrow="CAPABILITY MAP"
            title="AI 产品落地能力地图"
            controls={false}
          />
          <p className="section-lead">
            基于轻舟智航实习、比赛项目和个人 AI 实践，覆盖业务问题定义、产品方案设计、Agent/RAG 工作流落地、模型评测和 PoC 快速验证。
          </p>
          <div className="ability-gallery-shell">
            <CircularGallery items={abilityGalleryItems} />
          </div>
          <p className="ability-hint">向左滑动查看更多</p>
        </section>

        <section className="section section-bone" id="cases">
          <ThreadsBackground />
          <div className="section-head">
            <div>
              <p className="eyebrow">CORE CASES</p>
              <h2>
                <GradientText>企业与比赛产品案例</GradientText>
              </h2>
            </div>
          </div>

          <span className="case-anchor" id={`case-${activeCase.id}`} aria-hidden="true" />
          <ChromaGrid items={cases} activeId={activeCaseId} onSelect={selectCase} />

          <article className="case-detail-panel">
            <div className="case-detail-media">
              <img src={activeCase.image} alt={`${activeCase.title} 视觉图`} />
              <div className="feature-label">{activeCase.label}</div>
            </div>
            <div className="case-copy">
              <p className="eyebrow case-number">{activeCase.eyebrow}</p>
              <h3>{activeCase.title}</h3>
              <p>{activeCase.description}</p>
              <ul>
                {activeCase.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="proof-row">
                {activeCase.proof.map((proof) => (
                  <span key={proof}>{proof}</span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="statement">
          <ThreadsBackground />
          <p>
            <TextType text="好的 AI 产品不是把模型接进流程，而是把业务目标、用户旅程、可控边界和评测闭环一起放进交付标准。" />
          </p>
        </section>

        <section className="section" id="evaluation">
          <ThreadsBackground />
          <SectionHead
            eyebrow="EVALUATION & RELIABILITY"
            title="AI 产品稳定性与评测方法"
            controls={false}
          />
          <div className="evaluation-projects">
            {evaluationProjects.map((project) => (
              <ElectricBorder key={project.title}>
                <article className="evaluation-card">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="tag-row compact-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <ul className="evaluation-points">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="badcase-row">
                    {project.badCases.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              </ElectricBorder>
            ))}
          </div>
        </section>

        <section className="section section-bone" id="lab">
          <ThreadsBackground />
          <SectionHead eyebrow="AI LAB" title="个人 AI 实践" controls={false} />
          <p className="section-lead lab-lead">
            我把 AI 当作个人工作流和产品验证基础设施来实践，重点不是单点尝鲜，而是围绕知识管理、长文档问答、信息摘要、PRD 写作和科研表达，持续打磨可复用的 Agent 与 Skill 工作流。
          </p>
          <div className="practice-switcher">
            <div className="practice-nav" aria-label="个人 AI 实践项目">
              {labItems.map((item, index) => (
                <TargetCursor key={item.title}>
                  <button
                    className={`practice-nav-button ${index === activeLabIndex ? "is-active" : ""}`}
                    type="button"
                    onClick={() => setActiveLabIndex(index)}
                    aria-pressed={index === activeLabIndex}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.title}</strong>
                    <em>{item.tags.slice(0, 3).join(" / ")}</em>
                  </button>
                </TargetCursor>
              ))}
            </div>

            <div className="practice-detail" aria-live="polite">
              <p className="eyebrow">SELECTED WORKFLOW</p>
              <h3>{activeLabItem.title}</h3>
              <p className="practice-position">{activeLabItem.position}</p>
              <p>{activeLabItem.description}</p>
              <div className="proof-row">
                {activeLabItem.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {activeLabItem.screenshots?.length > 0 && (
                <div className="practice-preview">
                  <button
                    className="gallery-button"
                    type="button"
                    onClick={() =>
                      setScreenshotModal({
                        images: activeLabItem.screenshots,
                        eyebrow: "PREVIEW",
                        index: 0,
                        title: activeLabItem.title,
                      })
                    }
                  >
                    效果示意图
                  </button>
                  <div className="preview-thumb-grid" aria-label={`${activeLabItem.title} 效果图缩略图`}>
                    {activeLabItem.screenshots.map((image, index) => (
                      <button
                        className="preview-thumb"
                        key={image}
                        type="button"
                        onClick={() =>
                          setScreenshotModal({
                            images: activeLabItem.screenshots,
                            eyebrow: "PREVIEW",
                            index,
                            title: activeLabItem.title,
                          })
                        }
                      >
                        <img src={image} alt={`${activeLabItem.title} 效果图 ${index + 1}`} />
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section proof-section" id="proof">
          <ThreadsBackground />
          <SectionHead eyebrow="PROOF" title="成果与证书" controls={false} />
          <div className="proof-layout">
            <div className="award-grid">
              {awards.map(([index, title]) => (
                <SpotlightCard className="small-card" key={index}>
                  <span className="card-index">{index}</span>
                  <h3>{title}</h3>
                  {index === "National Prize" && (
                    <div className="award-certificate-actions">
                      <button
                        className="gallery-button"
                        type="button"
                        onClick={() =>
                          setScreenshotModal({
                            images: [certificateUrl],
                            eyebrow: "CERTIFICATE",
                            index: 0,
                            title,
                          })
                        }
                      >
                        查看证书
                      </button>
                      <button
                        className="certificate-thumb"
                        type="button"
                        onClick={() =>
                          setScreenshotModal({
                            images: [certificateUrl],
                            eyebrow: "CERTIFICATE",
                            index: 0,
                            title,
                          })
                        }
                      >
                        <img src={certificateUrl} alt={`${title}证书缩略图`} />
                        <span>证书预览</span>
                      </button>
                    </div>
                  )}
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <ThreadsBackground />
          <SectionHead eyebrow="CONTACT" title="联系我" controls={false} gradient={false} />
          <div className="contact-only-layout">
            <aside className="contact-card">
              <p className="eyebrow">CONTACT</p>
              <h3>期待在真实业务中，把 AI 能力落到可用、可靠、可评测、可持续迭代的产品流程里。</h3>
              <div className="contact-lines">
                <a href="mailto:2432265@tongji.edu.cn">2432265@tongji.edu.cn</a>
                <a href="tel:18474447573">18474447573</a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>GONG JIAHAO</span>
        <span>AI Product Manager Portfolio</span>
      </footer>

      <ScreenshotModal
        modal={screenshotModal}
        onClose={closeScreenshotModal}
        onNext={showNextScreenshot}
        onPrevious={showPreviousScreenshot}
      />
    </>
  );
}

export default App;
