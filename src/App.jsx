import { useEffect, useState } from "react";

import CardSwap, { Card } from "./components/CardSwap.jsx";
import ChromaGrid from "./components/ChromaGrid.jsx";
import CircularGallery from "./components/CircularGallery.jsx";
import BlurText from "./components/BlurText.jsx";
import GradientText from "./components/GradientText.jsx";
import LiquidEther from "./components/LiquidEther.jsx";
import TargetCursor from "./components/TargetCursor.jsx";
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
    description: "从 SOR 文档拆解、代码查询、走查报告、迎新咨询等真实场景中识别 AI 产品机会。",
    tags: "需求分析 / 用户流程 / 输入输出定义",
  },
  {
    index: "02",
    title: "AI 产品方案与 PRD 交付",
    description: "将业务需求转化为 PRD、流程图、原型、验收标准和人工介入节点。",
    tags: "PRD / 原型 / 流程 / 验收标准",
  },
  {
    index: "03",
    title: "Agent / RAG 工作流产品化",
    description: "设计文档解析、需求提取、知识库检索、满足性判定、人工复核等 AI 工作流。",
    tags: "LangGraph / RAG / MCP / VLM",
  },
  {
    index: "04",
    title: "模型评测与可靠性迭代",
    description: "构建问答测评集，用准确率、召回率、F1、答案一致性和成本评估模型表现。",
    tags: "bad case / Prompt 优化 / 成本评估",
  },
  {
    index: "05",
    title: "企业 AI 工具链落地",
    description: "连接飞书 Bot、Cursor Agent、GitLab MCP 与业务工具链，落地代码查询和报告生成场景。",
    tags: "飞书 Bot / Cursor Agent / MCP / 自动报告",
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

const createAbilityCardImage = ({ description, index, tags, title }) => {
  const descriptionLines = wrapText(description, 16).slice(0, 4);
  const tagLines = wrapText(tags, 22).slice(0, 2);
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
      <rect width="720" height="900" rx="46" fill="#ffffff"/>
      <rect x="24" y="24" width="672" height="852" rx="42" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="58" y="608" width="604" height="162" rx="28" fill="#f5f5f7"/>
      <text class="index" x="58" y="102">${escapeSvg(index)}</text>
      <text class="title" x="58" y="222">${escapeSvg(title)}</text>
      <text class="desc" x="58" y="342">${descriptionMarkup}</text>
      <line x1="58" y1="570" x2="662" y2="570" stroke="#d8dbe0" stroke-width="2"/>
      <text class="tags" x="58" y="670">${tagMarkup}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const abilityGalleryItems = abilities.map((item) => ({
  image: createAbilityCardImage(item),
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
      "面向技术规格文档人工拆解成本高、知识库比对依赖人工的问题，设计“文档解析 - 需求提取 - 知识库检索 - 满足性判定 - 人工复核”闭环。",
    bullets: [
      "书写 PRD，明确 Agent 输入输出、人工介入节点和验收标准。",
      "基于 LangGraph 设计 PDF 解析、图片识别、检索比对和循环纠错节点。",
      "接入飞书知识问答，通过并发控制、缓冲池和 VLM 兜底优化效率与成本。",
    ],
    proof: ["需求拆解", "Agent 工作流", "知识库检索", "人机协同"],
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
      "参与设计“飞书 Bot + cc-connect + Cursor Agent + MCP/业务工具链”架构，统一接入代码查询与自动走查报告生成能力。",
    bullets: [
      "梳理飞书交互层、Cursor Agent 执行层、MCP/HTTP 能力层和反馈闭环层。",
      "接入 GitLab MCP Server，让非研发角色用自然语言查询模块职责和实现逻辑。",
      "设计报告生成流程，支持走查记录校验、原子报告和对比报告自动生成。",
    ],
    proof: ["飞书 Bot", "Cursor Agent", "MCP 工具链", "报告生成"],
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
      "面向迎新咨询信息分散、人工压力大和终端管理复杂的问题，设计垂直领域咨询 Agent 与网络终端管理系统，获得全国二等奖。",
    bullets: [
      "设计“文档解析 - 语义分块 - 混合检索 - Prompt 约束 - 结果生成”链路。",
      "通过混合检索和多轮 Prompt 优化提升高频问题召回与回答准确性。",
      "配置 MCP_SSE 工具，实现哑终端在线监控、核心指标总结和运维支撑。",
    ],
    proof: ["RAG 架构", "混合检索", "安全边界", "比赛成果"],
  },
];

const evaluationProjects = [
  {
    title: "企业代码查询 Agent 测评",
    description:
      "基于 CodeSeeker 真实代码检索场景，构建开放式问题、普通问题和诱导性问题，验证 Agent 是否能稳定定位代码分支、检索关键配置并输出可复核答案。",
    tags: ["三轮重复推理", "准确率", "召回率", "F1", "答案一致性", "单题成本"],
    highlights: [
      "opus 4.8 综合表现最佳：Accuracy 92.86%，Recall 97.62%，F1 95.20%，Consistency 88.10%。",
      "gpt-5.3-codex 性价比最高：F1 93.91%，单题成本约 $0.6957。",
      "通过问题重构和系统提示词优化，误导性问题下的答案一致性从 61.90% 提升到 88.10%。",
    ],
    badCases: ["分支不明确", "浅层检索", "场景歧义", "诱导性问题", "Prompt 与 rules 冲突"],
  },
  {
    title: "校园迎新 RAG 智能体测评",
    description:
      "围绕迎新咨询与本地知识库问答场景，基于 Ragas 框架构建标准测试集，评估 RAG 的检索召回、回答精准度、证据相关性和幻觉控制能力。",
    tags: ["Ragas", "HybridSearch", "ChromaDB", "BM25", "BGE-Reranker", "MRR"],
    highlights: [
      "通过优化 ChunkSize、Overlap、HybridSearch 与重排序策略，检索召回率从 65% 提升至 82%。",
      "结合 ChromaDB 向量检索、BM25 关键词检索和 BGE-Reranker，回答精准度从 78% 提高到 94%。",
      "迭代多版 System Prompt，加入上下文边界与拒答机制，缓解大模型幻觉并约束输出符合业务规范。",
    ],
    badCases: ["切片过粗", "召回遗漏", "Top-K 证据不足", "Prompt 边界不足", "无依据回答"],
  },
];

const labItems = [
  {
    title: "个人知识库 Agent",
    position: "一个面向个人信息管理的知识入口 Agent，用来解决“收藏很多，但很难真正消化”的问题。",
    description:
      "以飞书机器人作为入口，通过 OpenClaw 将消息路由到 knowledge-inbox agent，并写入 Notion、Softr 与 Obsidian 组成的知识沉淀层。",
    tags: ["OpenClaw", "Feishu Bot", "Notion API", "Softr", "Obsidian", "OCR", "Knowledge Graph"],
    screenshots: [
      personalKnowledgeScreenshot,
      personalKnowledgeScreenshot2,
      personalKnowledgeScreenshot3,
      personalKnowledgeScreenshot4,
    ],
  },
  {
    title: "本地 PDF Chat RAG 智能体",
    position: "一个为了系统学习 RAG 而做的本地知识库项目，把 PDF 文档变成可以对话的资料库。",
    description:
      "跑通 PDF 提取、文档切分、向量化、FAISS、BM25、混合召回、CrossEncoder 重排和模型生成回答的完整链路。",
    tags: ["RAG", "PDF QA", "FAISS", "BM25", "Sentence Transformers", "CrossEncoder", "Gradio", "FastAPI"],
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
  ["National Prize", "大模型教育管理应用创新赛全国二等奖"],
  ["Language", "CET6"],
  ["Research", "两篇中文核心期刊通讯作者"],
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

  const { images, index, title } = modal;
  const canBrowse = images.length > 1;

  return (
    <div className="screenshot-modal" role="dialog" aria-modal="true" aria-label={`${title} 截图预览`}>
      <div className="modal-backdrop" aria-hidden="true" onClick={onClose} />
      <div className="modal-panel">
        <div className="modal-head">
          <div>
            <p className="eyebrow">SCREENSHOT</p>
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
    if (typeof window === "undefined") return "platform";
    const id = window.location.hash.replace("#case-", "");
    return cases.some((item) => item.id === id) ? id : "platform";
  };

  const [activeCaseId, setActiveCaseId] = useState(getInitialCaseId);
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const activeCase = cases.find((item) => item.id === activeCaseId) ?? cases[1];
  const activeLabItem = labItems[activeLabIndex];
  const [screenshotModal, setScreenshotModal] = useState(null);

  const selectCase = (id) => {
    setActiveCaseId(id);
    window.history.replaceState(null, "", `#case-${id}`);
  };

  useEffect(() => {
    const syncCaseFromHash = () => {
      const id = window.location.hash.replace("#case-", "");
      if (cases.some((item) => item.id === id)) {
        setActiveCaseId(id);
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
                聚焦 Agent、RAG 与企业提效工具，把复杂业务场景拆成可交付、可评测、可迭代的 AI 产品方案。
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
                {["AI 产品经理", "Agent", "RAG", "PRD", "模型评测", "企业提效工具"].map((tag) => (
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
            meta="一屏总览"
          />
          <p className="section-lead">
            围绕 Agent、RAG 与企业提效场景，完成从业务问题定义、产品方案设计到评测迭代的闭环。
          </p>
          <div className="ability-gallery-shell">
            <CircularGallery items={abilityGalleryItems} />
          </div>
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
            <BlurText>好的 AI 产品不是把模型接进流程，而是把业务目标、可控边界和评测闭环一起放进交付标准。</BlurText>
          </p>
        </section>

        <section className="section" id="evaluation">
          <ThreadsBackground />
          <SectionHead
            eyebrow="EVALUATION & RELIABILITY"
            title="AI 产品稳定性与评测方法"
            meta="效果可解释"
          />
          <div className="evaluation-projects">
            {evaluationProjects.map((project) => (
              <article className="evaluation-card" key={project.title}>
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
            ))}
          </div>
        </section>

        <section className="section section-bone" id="lab">
          <ThreadsBackground />
          <SectionHead eyebrow="AI LAB" title="个人 AI 实践" meta="长期工作流" />
          <p className="section-lead lab-lead">
            我把 AI 当作个人工作流的长期基础设施来实践，重点不是单点尝鲜，而是围绕信息摄入、知识沉淀、文档问答、日报生成和科研写作，逐步搭建属于自己的 Agent 与 Skill 体系。
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
              {activeLabItem.screenshots && (
                <button
                  className="gallery-button"
                  type="button"
                  onClick={() =>
                    setScreenshotModal({
                      images: activeLabItem.screenshots,
                      index: 0,
                      title: activeLabItem.title,
                    })
                  }
                >
                  查看截图
                </button>
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
                <article className="small-card" key={index}>
                  <span className="card-index">{index}</span>
                  <h3>{title}</h3>
                  {index === "National Prize" && (
                    <a className="gallery-button" href={certificateUrl} target="_blank" rel="noreferrer">
                      查看证书
                    </a>
                  )}
                </article>
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
              <h3>期待在真实业务中，把 AI 能力落到可用、可靠、可持续迭代的产品流程里。</h3>
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
