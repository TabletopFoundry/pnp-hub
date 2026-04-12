import type { ReactNode } from 'react';

type StatePanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function StatePanel({ eyebrow, title, description, action }: StatePanelProps) {
  return (
    <div className="paper-panel paper-texture rounded-[2rem] border border-[rgba(77,57,36,0.08)] px-6 py-8 text-center">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--terracotta)]">{eyebrow}</p> : null}
      <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[rgba(58,43,31,0.74)]">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
