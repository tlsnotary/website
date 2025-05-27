import { useColorMode } from "@docusaurus/theme-common";

import IconDiscord from "../../icons/IconDiscord";
import IconGithub from "../../icons/IconGithub";
import IconWebsite from "../../icons/IconWebsite";
import IconTwitter from "../../icons/IconTwitter";
import styles from "./styles.module.css";

interface ProjectLinks {
  website?: string;
  github?: string;
  discord?: string;
  twitter?: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  links: ProjectLinks;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  description,
  links,
  name,
}: ProjectCardProps) => {
  const { colorMode } = useColorMode();

  return (
    <div className={`${styles.card} ${styles[colorMode]}`}>
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{name}</h2>

        <p className={styles.cardDescription}>{description}</p>
      </div>

      {(links.website || links.github || links.discord) && (
        <div className={styles.cardFooter}>
          {links.github && (
            <a aria-label="GitHub" className={styles.cardFooterLink} href={links.github} rel="noopener noreferrer" target="_blank">
              <IconGithub />
            </a>
          )}

          {links.website && (
            <a aria-label="Website" href={links.website} rel="noopener noreferrer" target="_blank">
              <IconWebsite />
            </a>
          )}

          {links.discord && (
            <a aria-label="Discord" href={links.discord} rel="noopener noreferrer" target="_blank">
              <IconDiscord />
            </a>
          )}

          {links.twitter && (
            <a aria-label="Twitter" href={links.twitter} rel="noopener noreferrer" target="_blank">
              <IconTwitter />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
