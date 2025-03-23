import React, { useState } from 'react';
import { Download, Share2, Check, Quote } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Import font files to ensure they're included in the build
import woff2Font from '@/font/Huiwenmincho-improved.woff2';
import woffFont from '@/font/Huiwenmincho-improved.woff';
import ttfFont from '@/font/Huiwenmincho-improved.ttf';

type Theme = 'blue' | 'green' | 'purple' | 'orange';

interface Toast {
  message: string;
  visible: boolean;
}

interface CardTheme {
  bg: string;
  text: string;
  name: string;
  color: string;
}

const themes: Record<Theme, CardTheme> = {
  blue: {
    bg: 'bg-gray-100',
    text: 'text-[rgb(1,51,101)]',
    name: '沉稳蓝',
    color: 'rgb(1,51,101)'
  },
  green: {
    bg: 'bg-[rgb(229,245,239)]',
    text: 'text-[rgb(1,101,65)]',
    name: '优雅绿',
    color: 'rgb(1,101,65)'
  },
  purple: {
    bg: 'bg-[rgb(244,238,255)]',
    text: 'text-[rgb(107,33,168)]',
    name: '高贵紫',
    color: 'rgb(107,33,168)'
  },
  orange: {
    bg: 'bg-[rgb(255,247,238)]',
    text: 'text-[rgb(245,148,10)]',
    name: '活力橙',
    color: 'rgb(245,148,10)'
  }
};

function App() {
  const [title, setTitle] = useState('03/22');
  const [content, setContent] = useState('愿意放弃自由来换取保障的人，他最终既得不到自由，也得不到保障。');
  const [footer, setFooter] = useState('-哈耶克');
  const [theme, setTheme] = useState<Theme>('blue');
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [toast, setToast] = useState<Toast>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  const exportAsImage = async () => {
    const card = document.getElementById('quote-card');
    if (card) {
      try {
        setIsExportingImage(true);
        const dataUrl = await toPng(card, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'quote-card.png';
        link.href = dataUrl;
        link.click();
        showToast('图片导出成功！');
      } catch (err) {
        console.error('导出图片失败:', err);
      } finally {
        setIsExportingImage(false);
      }
    }
  };

  const exportAsHtml = async () => {
    try {
      setIsExportingHtml(true);
      const zip = new JSZip();

      const fontFiles = [
        { path: woff2Font, name: 'font/Huiwenmincho-improved.woff2' },
        { path: woffFont, name: 'font/Huiwenmincho-improved.woff' },
        { path: ttfFont, name: 'font/Huiwenmincho-improved.ttf' }
      ];

      for (const font of fontFiles) {
        const response = await fetch(font.path);
        const fontData = await response.arrayBuffer();
        zip.file(font.name, fontData);
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              @font-face {
                font-family: 'HuiWenMingChao';
                src: 
                  url('font/Huiwenmincho-improved.woff2') format('woff2'),
                  url('font/Huiwenmincho-improved.woff') format('woff'),
                  url('font/Huiwenmincho-improved.ttf') format('opentype');
              }
              .card {
                background-color: ${theme === 'blue' ? 'rgb(243,244,246)' :
          theme === 'green' ? 'rgb(229,245,239)' :
            theme === 'purple' ? 'rgb(244,238,255)' :
              'rgb(255,247,238)'};
                color: ${theme === 'blue' ? 'rgb(1,51,101)' :
          theme === 'green' ? 'rgb(1,101,65)' :
            theme === 'purple' ? 'rgb(107,33,168)' :
              'rgb(245,148,10)'};
                padding: 24px;
                border-radius: 16px;
                width: 500px;
                font-family: 'HuiWenMingChao', system-ui, -apple-system, sans-serif;
              }
              .card-head { font-size: 24px; opacity: 0.7; margin-bottom: 12px; }
              .card-main { 
                font-size: 40px; 
                line-height: 1.5; 
                white-space: pre-line;
              }
              .card-foot { font-size: 16px; opacity: 0.6; margin-top: 32px; }
            </style>
          </head>
          <body>
            <div class="card">
              ${title && `<div class="card-head">${title}</div>`}
              <div class="card-main">${content}</div>
              ${footer && `<div class="card-foot">${footer}</div>`}
            </div>
          </body>
        </html>
      `;

      zip.file('index.html', htmlContent);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quote-card.zip';
      link.click();
      URL.revokeObjectURL(url);
      showToast('源码导出成功！');
    } catch (error) {
      console.error('导出源码失败:', error);
    } finally {
      setIsExportingHtml(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* GitHub Corner */}
      <a
        href="https://github.com/iamjoel/quote-card-generator"
        className="hidden lg:block fixed top-0 right-0 z-50"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          className="absolute top-0 right-0 border-0"
          fill="#151513"
          style={{ color: '#fff' }}
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{ transformOrigin: '130px 106px' }}
            className="octo-arm"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          />
        </svg>
      </a>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Quote className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-['HuiWenMingChao']">
              金句卡片生成器
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              轻松创建简洁，美观的金句卡片
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-base font-medium mb-1.5 block">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入标题..."
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-base font-medium mb-1.5 block">
                内容 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="输入金句内容..."
                required
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-base font-medium mb-1.5 block">作者</Label>
              <Input
                id="author"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="输入作者..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                onClick={exportAsImage}
                size="lg"
                disabled={isExportingImage}
              >
                {isExportingImage ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    导出中...
                  </span>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    导出图片
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={exportAsHtml}
                size="lg"
                disabled={isExportingHtml}
              >
                {isExportingHtml ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    导出中...
                  </span>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    导出源码
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <div className="flex justify-end h-5 mb-2.5">
              <div className="flex gap-2">
                {(Object.entries(themes) as [Theme, CardTheme][]).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(
                      "w-5 h-5 rounded-full relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                      theme === key && "ring-2 ring-offset-2"
                    )}
                    style={{
                      backgroundColor: value.color,
                      ringColor: value.color
                    }}
                    title={value.name}
                  >
                    {theme === key && (
                      <Check className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              id="quote-card"
              className={`w-full rounded-xl p-6 ${themes[theme].bg} ${themes[theme].text} font-['HuiWenMingChao'] shadow-lg`}
            >
              {title && <div className="text-xl opacity-70 mb-4">{title}</div>}
              <div className="text-3xl leading-relaxed whitespace-pre-line">{content}</div>
              {footer && <div className="text-lg opacity-60 mt-8">{footer}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className={cn(
          "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 flex items-center",
          toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <Check className="w-4 h-4 mr-2" />
        {toast.message}
      </div>
    </div>
  );
}

export default App;