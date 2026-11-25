import { Fragment, type ElementType, type ReactNode } from 'react';

/**
 * Renders text as masked words for staggered reveals while keeping one unsplit,
 * accessible copy for assistive tech.
 */
export function Words({
  text,
  as: Tag = 'span',
  className = '',
  wordClass = 'split-word',
  mask = true,
  ...rest
}: {
  text: string;
  as?: ElementType;
  className?: string;
  wordClass?: string;
  mask?: boolean;
  [k: string]: unknown;
}) {
  const plain = text.replace(/\*/g, '');
  const tokens = text.split(/(\s+|\n)/);
  let i = 0;
  const out: ReactNode[] = [];
  tokens.forEach((tok, k) => {
    if (tok === '\n') {
      out.push(<br key={`br${k}`} />);
      return;
    }
    if (!tok.trim()) {
      out.push(<Fragment key={`s${k}`}> </Fragment>);
      return;
    }
    const word = tok.replace(/\*/g, '');
    const inner = (
      <span className={wordClass} style={{ ['--i' as string]: i++ }}>
        {word}
      </span>
    );
    out.push(
      mask ? (
        <span key={k} className="split-mask">
          {inner}
        </span>
      ) : (
        <Fragment key={k}>{inner}</Fragment>
      ),
    );
  });
  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
