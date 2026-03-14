import React from "react";
import { FullPageLoader } from "../../components/common/loaders";

/**
 * Full-page loading screen. Shown when global loading state is true (e.g. Redux).
 * Logic unchanged: still a presentational component; parent controls visibility.
 */
const Loading: React.FC = () => {
  return <FullPageLoader />;
};

export default Loading;
