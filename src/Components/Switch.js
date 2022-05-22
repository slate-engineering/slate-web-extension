import * as React from "react";

export const Match = React.memo((/** { component, when } */) => {
  return null;
});

// NOTE(amine): displayName is used to assert that direct children of Switch are the Match components
Match.displayName = "$";

export const Switch = React.memo(
  React.forwardRef(({ children, fallback = null }, ref) => {
    if (Array.isArray(children)) {
      for (let element of children) {
        if (element.type.displayName !== "$")
          console.error(
            "Switch component requires Match component as its children"
          );

        if (element.props.when) {
          const { component: Component, ...props } = element.props;
          return <Component ref={ref} {...props} />;
        }
      }

      return fallback;
    }

    if (children?.props?.when) return children;

    return fallback;
  })
);
