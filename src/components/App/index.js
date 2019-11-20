import React, { useRef, useEffect } from "react";
import styles from "./styles.scss";

import DotStage from "../DotStage";

export default props => {
  return (
    <div className={styles.root}>
      <DotStage />
    </div>
  );
};
