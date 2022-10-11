import * as React from "react";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { motion, useTransform, useMotionValue } from "framer-motion";

const STYLES_BUTTON_HOVER = (theme) => css`
  display: flex;
  background-color: ${theme.semantic.bgBlurWhite};
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.system.grayLight5}, ${theme.shadow.lightLarge};
  transition: box-shadow 0.3s;
  color: ${theme.semantic.textBlack};
  :hover {
    box-shadow: 0 0 0 1px ${theme.system.pink}, ${theme.shadow.lightLarge};
  }

  .button_path {
    transition: stroke 0.3s;
  }
  :hover .button_path {
    stroke: ${theme.system.pink};
  }
`;

export default function SaveButton({ onClick, isSaved, ...props }) {
  const pathLength = useMotionValue(0);
  const opacity = useTransform(pathLength, [0, 1], [0, 1]);

  return (
    <motion.button
      css={[Styles.BUTTON_RESET, STYLES_BUTTON_HOVER]}
      initial={{
        backgroundColor: isSaved
          ? Constants.system.redLight6
          : Constants.semantic.bgBlurWhite,
      }}
      animate={{
        backgroundColor: isSaved
          ? Constants.system.redLight6
          : Constants.semantic.bgBlurWhite,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
    >
      <span css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <motion.svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <motion.path
            className="button_path"
            d="M14.6667 12.6667C14.6667 13.0203 14.5262 13.3594 14.2761 13.6095C14.0261 13.8595 13.6869 14 13.3333 14H2.66665C2.31303 14 1.97389 13.8595 1.72384 13.6095C1.47379 13.3594 1.33332 13.0203 1.33332 12.6667V3.33333C1.33332 2.97971 1.47379 2.64057 1.72384 2.39052C1.97389 2.14048 2.31303 2 2.66665 2H5.99998L7.33332 4H13.3333C13.6869 4 14.0261 4.14048 14.2761 4.39052C14.5262 4.64057 14.6667 4.97971 14.6667 5.33333V12.6667Z"
            stroke={Constants.system.black}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              fill: isSaved
                ? Constants.system.pink
                : Constants.semantic.bgBlurWhite,
              stroke: isSaved ? Constants.system.pink : Constants.system.black,
            }}
            animate={{
              fill: isSaved
                ? Constants.system.pink
                : Constants.semantic.bgBlurWhite,
              stroke: isSaved ? Constants.system.pink : Constants.system.black,
            }}
          />
          <motion.path
            className="button_path"
            d="M8 7.33332V11.3333"
            animate={{ y: isSaved ? 2 : 0, opacity: isSaved ? 0 : 1 }}
            stroke="#00050A"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            className="button_path"
            d="M6 9.33332H10"
            stroke="#00050A"
            animate={{ x: isSaved ? 2 : 0, opacity: isSaved ? 0 : 1 }}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/**  NOTE(amine): checkmark path */}
          <motion.path
            initial={{
              pathLength: isSaved ? 1 : pathLength,
              stroke: Constants.system.white,
            }}
            animate={{ pathLength: isSaved ? 1 : 0 }}
            style={{ pathLength, opacity }}
            d="M6 9.15385L6.92308 10.0769L10 7"
            stroke="#00050A"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </span>
    </motion.button>
  );
}
