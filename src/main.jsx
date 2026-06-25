import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDot,
  Compass,
  Dices,
  FunctionSquare,
  Grid3X3,
  Ruler,
  Sigma,
  Waves
} from 'lucide-react';
import Aurora from './react-bits/Aurora.jsx';
import GradientText from './react-bits/GradientText.jsx';
import SpotlightCard from './react-bits/SpotlightCard.jsx';
import brandLogoUrl from './assets/brand-logo.png?inline';
import './styles.css';

const subjects = {
  linear: {
    key: 'linear',
    name: '线性代数',
    englishName: 'Linear Algebra',
    tone: '紫色',
    color: '#9b7cff',
    color2: '#d7b8ff',
    rgb: '155, 124, 255'
  },
  probability: {
    key: 'probability',
    name: '概率论',
    englishName: 'Probability Theory',
    tone: '蓝色',
    color: '#58a6ff',
    color2: '#9ed8ff',
    rgb: '88, 166, 255'
  },
  calculus: {
    key: 'calculus',
    name: '微积分',
    englishName: 'Calculus',
    tone: '绿色',
    color: '#67e8a5',
    color2: '#c6ffd8',
    rgb: '103, 232, 165'
  }
};

const homeTheme = {
  key: 'home',
  name: '首页',
  tone: '青蓝色',
  color: '#4fd5c8',
  color2: '#88c0ff',
  rgb: '79, 213, 200',
  englishName: 'Visual Math Lab'
};

const demos = [
  {
    id: 'linear-combo',
    title: '方程组与向量线性组合',
    subject: 'linear',
    href: '线性代数/方程组与向量线性组合.html',
    summary: '拖动目标点与基向量，观察线性组合如何刻画方程组解的几何位置。',
    icon: FunctionSquare,
    formula: 'A x = b'
  },
  {
    id: 'quadratic-form',
    title: '二次型曲线与正交变换',
    subject: 'linear',
    href: '线性代数/二次型曲线与正交变换.html',
    summary: '把坐标轴旋到特征方向，看二次型曲线怎样从交叉项中被解耦。',
    icon: Compass,
    formula: 'x^T A x'
  },
  {
    id: 'eigen',
    title: '特征值、特征向量与相似对角化',
    subject: 'linear',
    href: '线性代数/特征值、特征向量与相似对角化.html',
    summary: '沿输入、输出和分解轨迹播放矩阵变换，理解对角化背后的坐标语言。',
    icon: Grid3X3,
    formula: 'A = P D P^-1'
  },
  {
    id: 'continuous-rv',
    title: '二维连续随机变量',
    subject: 'probability',
    href: '概率论/二维连续随机变量.html',
    summary: '在三维曲面、联合分布、边缘密度之间切换，拖动阈值感受概率体积。',
    icon: Waves,
    formula: 'f(x, y)'
  },
  {
    id: 'normal-2d',
    title: '二维正态分布',
    subject: 'probability',
    href: '概率论/二维正态分布.html',
    summary: '调节均值、方差和相关系数，观察钟形曲面与等高线如何同步变形。',
    icon: CircleDot,
    formula: 'N(mu, Sigma)'
  },
  {
    id: 'normal-cdf',
    title: '正态分布与分布函数',
    subject: 'probability',
    href: '概率论/正态分布与分布函数.html',
    summary: '拖动 μ、σ² 和竖线 x=a，观察钟形曲线、左侧面积与分布函数 F(a) 的同步变化。',
    icon: Waves,
    formula: 'F(a)=P(X≤a)'
  },
  {
    id: 'sampling-distributions',
    title: '抽样分布',
    subject: 'probability',
    href: '概率论/抽样分布曲线实验室.html',
    summary: '切换卡方、F 与 t 分布，调节自由度，观察曲线形状、偏斜和尾部厚度的变化规律。',
    icon: Sigma,
    formula: 'χ² / F / t'
  },
  {
    id: 'clt-dice',
    title: '中心极限定理示例1:骰子',
    subject: 'probability',
    href: '概率论/中心极限定理：骰子均值与个体分布.html',
    summary: '分别统计单个骰子结果和30个骰子均值，直观看出均匀分布与钟形分布的差别。',
    icon: Dices,
    formula: 'X̄₃₀'
  },
  {
    id: 'clt-height',
    title: '中心极限定理示例2:统计身高',
    subject: 'probability',
    href: '概率论/中心极限定理：学生身高与班级平均.html',
    summary: '分别统计单个学生身高和30人班级平均身高，观察个体波动与均值波动的差异。',
    icon: Ruler,
    formula: 'H̄₃₀'
  },
  {
    id: 'curve-integral-green',
    title: '曲线积分',
    subject: 'calculus',
    href: '微积分/曲线积分与格林公式.html',
    summary: '随机生成二维向量场和开闭轨迹，拖动进度条观察物块沿路径运动与做功累计。',
    icon: Waves,
    formula: '∫C F·dr'
  },
  {
    id: 'fourier-series',
    title: '傅立叶级数',
    subject: 'calculus',
    href: '微积分/傅立叶级数学习工具.html',
    summary: '选择或绘制周期函数，拖动项数 N，观察傅立叶部分和与系数如何逼近原函数。',
    icon: Sigma,
    formula: 'S_N(x)'
  },
  {
    id: 'surface-integral-coordinates',
    title: '对坐标的曲面积分',
    subject: 'calculus',
    href: '微积分/对坐标的曲面积分.html',
    summary: '旋转三维曲面，打开三个坐标面投影，观察向量场箭头如何形成通量贡献。',
    icon: Waves,
    formula: '∫∫Σ F·n dS'
  }
];

const subjectOrder = ['linear', 'probability', 'calculus'];

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [type, id] = hash.split('/');
  if (type === 'demo' && demos.some(demo => demo.id === id)) return { type: 'demo', id };
  if (type === 'subject' && subjects[id]) return { type: 'subject', id };
  return { type: 'home' };
}

function encodedHref(href) {
  return href
    .split('/')
    .map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
    .join('/');
}

function setRoute(route) {
  window.location.hash = route;
}

function App() {
  const [route, setRouteState] = useState(getRoute);

  useEffect(() => {
    const syncRoute = () => setRouteState(getRoute());
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  const selectedDemo = route.type === 'demo' ? demos.find(demo => demo.id === route.id) : null;
  const activeSubject = selectedDemo?.subject ?? (route.type === 'subject' ? route.id : null);
  const theme = selectedDemo ? subjects[selectedDemo.subject] : activeSubject ? subjects[activeSubject] : homeTheme;
  const visibleDemos = useMemo(
    () => (activeSubject ? demos.filter(demo => demo.subject === activeSubject) : demos),
    [activeSubject]
  );

  return (
    <main
      className={`app-shell theme-${theme.key}`}
      style={{
        '--accent': theme.color,
        '--accent-2': theme.color2,
        '--accent-rgb': theme.rgb
      }}
    >
      <div className="aurora-layer" aria-hidden="true">
        <Aurora colorStops={['#081017', theme.color, theme.color2]} amplitude={0.78} blend={0.64} speed={0.5} />
      </div>
      <div className="grid-layer" aria-hidden="true" />

      <Header activeSubject={activeSubject} />

      {selectedDemo ? (
        <LessonShell demo={selectedDemo} theme={theme} />
      ) : (
        <HomeSurface demos={visibleDemos} theme={theme} activeSubject={activeSubject} />
      )}
    </main>
  );
}

function Header({ activeSubject }) {
  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => setRoute('/')}>
        <span className="brand-mark"><img className="brand-logo" src={brandLogoUrl} alt="" /></span>
        <span>Visual Math Lab</span>
      </button>
      <nav className="subject-nav" aria-label="学科导航">
        {subjectOrder.map(key => (
          <button
            key={key}
            type="button"
            className={activeSubject === key ? 'active' : ''}
            style={{ '--subject-color': subjects[key].color, '--subject-rgb': subjects[key].rgb }}
            onClick={() => setRoute(`/subject/${key}`)}
          >
            <span>{subjects[key].name}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

function HomeSurface({ demos: visibleDemos, theme, activeSubject }) {
  const heroTitle = activeSubject ? subjects[activeSubject].englishName : homeTheme.englishName;

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-copy">
          <h1>
            <GradientText colors={['#ecf7fb', theme.color, theme.color2]} animationSpeed={9}>
              <span className="headline-line">{heroTitle}</span>
            </GradientText>
          </h1>
        </div>

        <div className="stage-column">
          <MathStage mode={activeSubject ?? 'home'} theme={theme} />
        </div>
      </section>

      <section className="module-section" id="modules" aria-label="知识点模块">
        <div className={`section-head${activeSubject ? '' : ' section-head--count-only'}`}>
          {activeSubject && (
            <div>
              <h2>{`${subjects[activeSubject].name}知识点`}</h2>
            </div>
          )}
          <div className="section-count">{visibleDemos.length} 个模块</div>
        </div>
        <ModuleGrid demos={visibleDemos} />
      </section>
    </>
  );
}

function MathStage({ mode, theme }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0.58, y: 0.48, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setPointer = event => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
        active: true
      };
    };

    const leavePointer = () => {
      pointerRef.current.active = false;
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(236, 247, 251, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 42) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 42) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const glow = (x, y, radius, color, alpha) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color.replace('1)', `${alpha})`));
      gradient.addColorStop(1, color.replace('1)', '0)'));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawVector = (x1, y1, x2, y2, color) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 13 * Math.cos(angle - 0.46), y2 - 13 * Math.sin(angle - 0.46));
      ctx.lineTo(x2 - 13 * Math.cos(angle + 0.46), y2 - 13 * Math.sin(angle + 0.46));
      ctx.closePath();
      ctx.fill();
    };

    const drawWave = (offset, color, amp = 32) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y = height * 0.58 + Math.sin(x * 0.018 + frame * 0.028 + offset) * amp + Math.sin(x * 0.044 - offset) * 11;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawContours = (cx, cy, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 7; i += 1) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, 42 + i * 24, 18 + i * 12, 0.45 + pointerRef.current.x * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawFrame = () => {
      frame += 1;
      const p = pointerRef.current;
      const px = p.x * width;
      const py = p.y * height;
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      glow(px, py, 210, `rgba(${theme.rgb}, 1)`, p.active ? 0.18 : 0.1);

      if (mode === 'linear') {
        const originX = width * 0.5;
        const originY = height * 0.55;
        const angle = -0.85 + p.x * 0.95;
        drawVector(originX, originY, originX + Math.cos(angle) * 170, originY + Math.sin(angle) * 170, theme.color);
        drawVector(originX, originY, originX - 145 + p.x * 80, originY + 70 - p.y * 120, '#d7b8ff');
        drawVector(originX, originY, originX + 130, originY + 86, 'rgba(236, 247, 251, 0.72)');
        ctx.strokeStyle = 'rgba(155, 124, 255, 0.24)';
        for (let i = -4; i <= 4; i += 1) {
          ctx.beginPath();
          ctx.moveTo(originX - 240, originY + i * 32 + p.y * 16);
          ctx.lineTo(originX + 260, originY + i * 20 - p.x * 20);
          ctx.stroke();
        }
      } else if (mode === 'probability') {
        drawContours(width * (0.38 + p.x * 0.24), height * (0.44 + p.y * 0.16), theme.color);
        drawContours(width * 0.62, height * 0.5, 'rgba(158, 216, 255, 0.38)');
        ctx.fillStyle = 'rgba(158, 216, 255, 0.68)';
        for (let i = 0; i < 90; i += 1) {
          const a = i * 12.989 + frame * 0.015;
          const x = width * 0.52 + Math.cos(a) * (30 + (i % 18) * 7) + (p.x - 0.5) * 90;
          const y = height * 0.48 + Math.sin(a * 1.7) * (18 + (i % 11) * 5) + (p.y - 0.5) * 50;
          ctx.fillRect(x, y, 2, 2);
        }
      } else if (mode === 'calculus') {
        const plotLeft = Math.max(34, width * 0.08);
        const plotRight = width - Math.max(24, width * 0.06);
        const xAxisY = height * 0.74;
        const yTop = height * 0.18;
        const yAxisX = plotLeft + 8;
        const plotWidth = plotRight - yAxisX;
        const plotHeight = xAxisY - yTop;
        const phase = Math.sin(frame * 0.012) * 0.04 + (p.active ? (p.x - 0.5) * 0.05 : 0);
        const f = t => {
          const raw =
            0.52 +
            0.18 * Math.sin(Math.PI * 2 * (t * 1.12 + phase + 0.08)) +
            0.11 * Math.sin(Math.PI * 2 * (t * 2.45 + 0.32 - phase * 0.7)) +
            0.07 * Math.cos(Math.PI * 2 * (t * 4.1 + 0.18));
          return Math.min(0.88, Math.max(0.18, raw));
        };
        const curveY = t => xAxisY - f(t) * plotHeight;

        ctx.strokeStyle = 'rgba(198, 255, 216, 0.68)';
        ctx.fillStyle = 'rgba(198, 255, 216, 0.68)';
        ctx.lineWidth = 2;
        drawVector(yAxisX, xAxisY, plotRight, xAxisY, 'rgba(198, 255, 216, 0.68)');
        drawVector(yAxisX, xAxisY, yAxisX, yTop, 'rgba(198, 255, 216, 0.68)');

        ctx.fillStyle = 'rgba(236, 247, 251, 0.72)';
        ctx.font = '700 14px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText('x', plotRight - 12, xAxisY - 14);
        ctx.fillText('y', yAxisX + 13, yTop + 17);
        ctx.fillText('0', yAxisX - 17, xAxisY + 19);

        ctx.beginPath();
        ctx.moveTo(yAxisX, curveY(0));
        for (let i = 1; i <= 160; i += 1) {
          const t = i / 160;
          ctx.lineTo(yAxisX + t * plotWidth, curveY(t));
        }
        ctx.lineTo(plotRight, xAxisY);
        ctx.lineTo(yAxisX, xAxisY);
        ctx.closePath();
        const areaGradient = ctx.createLinearGradient(0, yTop, 0, xAxisY);
        areaGradient.addColorStop(0, 'rgba(103, 232, 165, 0.22)');
        areaGradient.addColorStop(1, 'rgba(103, 232, 165, 0.04)');
        ctx.fillStyle = areaGradient;
        ctx.fill();

        const segmentCount = 18;
        const segmentWidth = plotWidth / segmentCount;
        for (let i = 0; i < segmentCount; i += 1) {
          const x0 = yAxisX + i * segmentWidth;
          const midT = (i + 0.5) / segmentCount;
          const y = curveY(midT);
          const emphasis = 0.18 + 0.18 * Math.sin(frame * 0.025 + i * 0.55);
          ctx.fillStyle = `rgba(103, 232, 165, ${0.12 + emphasis * 0.18})`;
          ctx.strokeStyle = `rgba(198, 255, 216, ${0.18 + emphasis})`;
          ctx.lineWidth = 1;
          ctx.fillRect(x0 + 1, y, Math.max(2, segmentWidth - 2), xAxisY - y);
          ctx.strokeRect(x0 + 1, y, Math.max(2, segmentWidth - 2), xAxisY - y);
        }

        ctx.beginPath();
        ctx.moveTo(yAxisX, curveY(0));
        for (let i = 1; i <= 160; i += 1) {
          const t = i / 160;
          ctx.lineTo(yAxisX + t * plotWidth, curveY(t));
        }
        ctx.strokeStyle = theme.color;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = 'rgba(236, 247, 251, 0.82)';
        ctx.font = '700 15px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText('f(x)', yAxisX + plotWidth * 0.76, curveY(0.76) - 16);
      } else {
        drawWave(0, 'rgba(79, 213, 200, 0.72)', 24);
        drawContours(width * (0.62 + (p.x - 0.5) * 0.18), height * 0.47, 'rgba(136, 192, 255, 0.45)');
        drawVector(width * 0.28, height * 0.68, width * (0.38 + p.x * 0.2), height * (0.34 + p.y * 0.18), theme.color);
        drawVector(width * 0.28, height * 0.68, width * 0.58, height * 0.62, '#88c0ff');
      }

      raf = requestAnimationFrame(drawFrame);
    };

    resize();
    drawFrame();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', setPointer);
    canvas.addEventListener('pointerleave', leavePointer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', setPointer);
      canvas.removeEventListener('pointerleave', leavePointer);
    };
  }, [mode, theme.color, theme.rgb]);

  return (
    <div className="math-stage">
      <canvas ref={canvasRef} aria-label={`${theme.name}数学动效`} />
    </div>
  );
}

function ModuleGrid({ demos: moduleDemos }) {
  return (
    <div className="module-grid">
      {moduleDemos.map((demo, index) => {
        const Icon = demo.icon;
        const subject = subjects[demo.subject];
        return (
          <SpotlightCard
            key={demo.id}
            className="module-card"
            spotlightColor={`rgba(${subject.rgb}, 0.2)`}
            style={{ '--module-color': subject.color, '--module-rgb': subject.rgb }}
          >
            <a className="module-link" href={`#/demo/${demo.id}`}>
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="card-icon"><Icon size={22} /></span>
              <span className="card-body">
                <span className="card-category">{subject.name}</span>
                <strong>{demo.title}</strong>
                <span>{demo.summary}</span>
              </span>
              <span className="formula">{demo.formula}</span>
            </a>
          </SpotlightCard>
        );
      })}
    </div>
  );
}

function LessonShell({ demo, theme }) {
  const subject = subjects[demo.subject];

  return (
    <section className="lesson-shell" aria-label={`${demo.title}展示页`}>
      <div className="lesson-head">
        <button type="button" className="back-button" onClick={() => setRoute(`/subject/${demo.subject}`)}>
          <ArrowLeft size={18} />
          {subject.name}模块
        </button>
        <div className="lesson-title">
          <span>{subject.name}</span>
          <h1>{demo.title}</h1>
          <p>{demo.summary}</p>
        </div>
        <a className="open-raw" href={encodedHref(demo.href)} target="_blank" rel="noreferrer">
          独立打开 <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="lesson-frame-wrap">
        <iframe title={demo.title} src={encodedHref(demo.href)} />
      </div>
      <div className="lesson-glow" style={{ background: `radial-gradient(circle, rgba(${theme.rgb}, 0.18), transparent 62%)` }} />
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
