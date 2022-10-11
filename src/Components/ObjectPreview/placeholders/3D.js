import * as React from "react";

import { css } from "@emotion/react";

export default function Object3DPlaceholder({ ratio = 1, ...props }) {
  const STYLES_PLACEHOLDER = React.useMemo(
    () => css`
      overflow: visible !important;
      width: ${(64 / 248) * 100 * ratio}%;
      height: ${(71.25 / 248) * 100 * ratio}%;
    `,
    [ratio]
  );

  return (
    <svg
      width={64}
      height={71.25}
      viewBox="0 -5 64 71.25"
      css={STYLES_PLACEHOLDER}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask id="prefix__a" maskUnits="userSpaceOnUse" x={1} y={3} width={64} height={65}>
        <path
          d="M65 48.136V22.531a5.919 5.919 0 00-.954-3.197 6.8 6.8 0 00-2.602-2.34L36.556 4.19A7.727 7.727 0 0033 3.333a7.727 7.727 0 00-3.556.858L4.556 16.994a6.8 6.8 0 00-2.601 2.34A5.918 5.918 0 001 22.53v25.605a5.919 5.919 0 00.955 3.197 6.801 6.801 0 002.6 2.34l24.89 12.803a7.728 7.728 0 003.555.857 7.728 7.728 0 003.556-.857l24.888-12.803a6.801 6.801 0 002.602-2.34A5.92 5.92 0 0065 48.136z"
          fill="url(#prefix__paint0_linear)"
        />
      </mask>
      <g mask="url(#prefix__a)">
        <path
          d="M33 36.185l32-16.852.333 33.334L33 69.333V36.185z"
          fill="url(#prefix__paint1_linear)"
        />
        <path
          d="M33.333 36.185l-32-16.852L1 52.667l32.333 16.666V36.185z"
          fill="url(#prefix__paint2_linear)"
        />
        <path d="M33 1.667l-33 17L33 36l33-17.333-33-17z" fill="url(#prefix__paint3_linear)" />
      </g>
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={33}
          y1={3.333}
          x2={33}
          y2={67.333}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#C7C7CC" />
        </linearGradient>
        <linearGradient
          id="prefix__paint1_linear"
          x1={46.926}
          y1={28.669}
          x2={65.537}
          y2={61.622}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#C7C7CC" />
        </linearGradient>
        <linearGradient
          id="prefix__paint2_linear"
          x1={19.407}
          y1={28.669}
          x2={0.796}
          y2={61.622}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#C7C7CC" />
        </linearGradient>
        <linearGradient
          id="prefix__paint3_linear"
          x1={33.667}
          y1={1.667}
          x2={28.494}
          y2={36.328}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0.5} />
          <stop offset={1} stopColor="#F7F8F9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
