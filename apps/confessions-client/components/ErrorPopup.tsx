import * as React from "react";
import { useCallback } from "react";
import styled from "styled-components";

export function ErrorPopup({
  error,
  onClose,
}: {
  error: ConfessionsError;
  onClose: () => void;
}) {
  const ignore = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <ModalBg onClick={onClose}>
      <ErrorWrap onClick={ignore}>
        <br />
        <h1>{error.title}</h1>
        <br />
        <p>{error.message}</p>
        {error.stack && (
            <>
            <br />
            <pre>{error.stack}</pre>
            </>
        )}
        <br/>
        <button onClick={onClose}>Close</button>
      </ErrorWrap>
    </ModalBg>
  );
}

export interface ConfessionsError {
  /** Big title, should be under 40 chars */
  title: string;
  /** Useful explanation, avoid "Something went wrong." */
  message: string | React.ReactNode;
  /** Optional stacktrace. */
  stack?: string;
}

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const ErrorWrap = styled.div`
  background: radial-gradient(circle, var(--bg-lite-gray), var(--bg-dark-gray));
  top: 64px;
  left: 0;
  width: 100%;
  max-width: 420px;
  margin: 64px auto 0 auto;
  min-height: 480px;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
`;