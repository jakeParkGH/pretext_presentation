import React, { useState } from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';

export const codeTheme: PrismTheme = {
  plain: {
    color: '#38302a',
    backgroundColor: '#faf6ee',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#8c827a',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#5c544d',
      },
    },
    {
      types: ['tag', 'property', 'deleted'],
      style: {
        color: '#b33927', // warm red
      },
    },
    {
      types: ['boolean', 'number'],
      style: {
        color: '#955f3b', // warm accent
      },
    },
    {
      types: ['constant'],
      style: {
        color: '#955f3b',
        fontWeight: '600',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted', 'attr-value'],
      style: {
        color: '#2b7a4b', // warm green
      },
    },
    {
      types: ['operator', 'entity', 'url'],
      style: {
        color: '#2563eb',
      },
    },
    {
      types: ['atrule', 'keyword'],
      style: {
        color: '#955f3b',
        fontWeight: '600',
      },
    },
    {
      types: ['function', 'function-name', 'method'],
      style: {
        color: '#1d4ed8',
        fontWeight: '700',
      },
    },
    {
      types: ['class-name', 'maybe-class-name'],
      style: {
        color: '#b45309',
        fontWeight: '600',
      },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: '#b33927',
      },
    },
  ],
};

export interface CodeSnippet {
  tabLabel: string;
  title?: string;
  filePath?: string;
  language?: string;
  code: string;
  explanation: string;
}

interface CodeViewerProps {
  title: string;
  snippets?: CodeSnippet[];
  filePath?: string;
  code?: string;
  explanation?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  title,
  snippets,
  filePath,
  code,
  explanation,
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);

  const allSnippets: CodeSnippet[] =
    snippets && snippets.length > 0
      ? snippets
      : [
          {
            tabLabel: '코드',
            title,
            filePath,
            code: code || '',
            explanation: explanation || '',
          },
        ];

  const currentSnippet = allSnippets[activeSnippetIndex] || allSnippets[0]!;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--rule)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginTop: '16px',
      }}
    >
      <div
        style={{
          background: 'rgba(149, 95, 59, 0.04)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--rule-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent)' }}>
            📖 {title}
          </span>

          {allSnippets.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '4px',
                background: 'var(--page)',
                padding: '2px',
                borderRadius: '6px',
                border: '1px solid var(--rule)',
                overflowX: 'auto',
              }}
            >
              {allSnippets.map((snippet, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSnippetIndex(idx)}
                  style={{
                    border: 'none',
                    background: activeSnippetIndex === idx ? 'var(--panel)' : 'transparent',
                    color: activeSnippetIndex === idx ? 'var(--accent)' : 'var(--muted)',
                    fontSize: '11.5px',
                    fontWeight: activeSnippetIndex === idx ? 700 : 500,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    boxShadow: activeSnippetIndex === idx ? '0 1px 4px rgba(54,40,23,0.06)' : 'none',
                  }}
                >
                  {snippet.tabLabel}
                </button>
              ))}
            </div>
          )}

          {currentSnippet.filePath && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--muted)' }}>
              ({currentSnippet.filePath})
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsOpen(!isOpen)}
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            {isOpen ? '코드 접기' : '코드 펼쳐보기'}
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={handleCopy}
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              minWidth: '75px',
              textAlign: 'center',
              color: copied ? 'var(--green)' : 'var(--ink)',
              borderColor: copied ? 'var(--green)' : 'var(--rule)',
            }}
          >
            {copied ? '✓ 복사됨' : '코드 복사'}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--page)',
              borderBottom: '1px solid var(--rule-light)',
              fontSize: '13px',
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            💡 <strong style={{ color: 'var(--ink)' }}>핵심 최적화 포인트:</strong>{' '}
            {currentSnippet.explanation}
          </div>

          <Highlight
            theme={codeTheme}
            code={currentSnippet.code.trim()}
            language={currentSnippet.language || 'tsx'}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={className}
                style={{
                  ...style,
                  margin: 0,
                  padding: '16px 0',
                  overflowX: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  fontFamily: 'var(--mono)',
                  border: 'none',
                  borderRadius: 0,
                }}
              >
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '0 16px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '32px',
                        userSelect: 'none',
                        color: 'var(--rule)',
                        fontSize: '11px',
                        textAlign: 'right',
                        paddingRight: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, whiteSpace: 'pre' }}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </>
      )}
    </div>
  );
};
