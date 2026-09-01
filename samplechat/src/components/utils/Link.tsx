import * as React from 'react';

interface LinkProps {
  content: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const { disabled, content, onClick } = props;
  const exec = disabled ? undefined : onClick;
  return (
    <span className={`link ${disabled ? 'disabled' : ''}`} onClick={exec}>
      {content}
    </span>
  );
};
