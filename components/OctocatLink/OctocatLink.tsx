import classNames from "classnames";
import { OctocatOcticon } from "../Icons";

import styles from "./OctocatLink.module.css";

type Props = {
  repo: string;
  className?: string;
};

const OctocatLink = ({ repo, className }: Props) => (
  <a className={styles.link} href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">
    <OctocatOcticon fill="currentColor" className={classNames("icon", className)} />
  </a>
);

export default OctocatLink;