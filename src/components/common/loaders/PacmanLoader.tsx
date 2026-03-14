import React from "react";
import { PacmanLoader as ReactSpinnersPacman } from "react-spinners";

/** Palette: nền tảng học vẽ & mỹ thuật thiếu nhi */
const LOADER_COLOR = "#E6C229";

export type Size = "small" | "medium" | "large";

const sizeMap: Record<Size, number> = {
  small: 24,
  medium: 40,
  large: 56,
};

export interface PacmanLoaderProps {
  size?: Size;
  className?: string;
}

/**
 * PacmanLoader từ react-spinners, dùng màu theme.
 * Dùng cho FullPageLoader, SectionLoader, InlineLoader.
 */
export const PacmanLoader: React.FC<PacmanLoaderProps> = ({
  size = "medium",
  className = "",
}) => (
  <div className={className} role="status" aria-label="Đang tải">
    <ReactSpinnersPacman
      color={LOADER_COLOR}
      loading
      size={sizeMap[size]}
      speedMultiplier={1}
    />
  </div>
);

/** Full-page overlay loader. Use for global loading (e.g. Redux loading state). */
export const FullPageLoader: React.FC = () => (
  <div
    className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white/95"
    role="status"
    aria-live="polite"
  >
    <span className="pacman-sr-only">Đang tải nội dung. Vui lòng chờ.</span>
    <PacmanLoader size="large" />
    <style>{`.pacman-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`}</style>
  </div>
);

/** Section loader: centered in a min-height area. Use for page/section loading. Optional children (e.g. text) shown below. */
export const SectionLoader: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = "", children }) => (
  <div
    className={`flex flex-col justify-center items-center min-h-[60vh] w-full gap-3 ${className}`}
    role="status"
    aria-label="Đang tải"
  >
    <PacmanLoader size="large" />
    {children}
  </div>
);

/** Inline loader: for modals, tables, small areas. */
export const InlineLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`flex justify-center items-center py-8 w-full ${className}`}
    role="status"
    aria-label="Đang tải"
  >
    <PacmanLoader size="medium" />
  </div>
);

/** Tiny loader for tight spaces (e.g. inside table cell). */
export const InlineLoaderSmall: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`flex justify-center items-center py-4 w-full ${className}`}
    role="status"
    aria-label="Đang tải"
  >
    <PacmanLoader size="small" />
  </div>
);
