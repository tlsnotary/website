import { useColorMode } from "@docusaurus/theme-common";
import React, { useState, useEffect, useCallback } from "react";

import projects from "../../content/projects.json";
import ActionCard from "../ActionCard";
import ProjectCard from "../ProjectCard";

import styles from "./styles.module.css";

interface Project {
  name: string;
  description: string;
  links: {
    website?: string;
    github?: string;
    discord?: string;
    twitter?: string;
  };
}

const typedProjects = projects as unknown as Project[];

const sortedProjects = typedProjects.slice().sort((a, b) => a.name.localeCompare(b.name));

function chunkArray(array: Project[]): Project[][] {
  const result = [];
  for (let i = 0; i < array.length; i += 9) {
    const chunk = array.slice(i, i + 9);
    result.push(chunk);
  }
  return result.length === 0 ? [[]] : result;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[][]>(chunkArray(sortedProjects));
  const [currentPage, setCurrentPage] = useState(0);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setProjects(chunkArray(sortedProjects));
    setCurrentPage(0);
  }, []);

  return (
    <div className={`${styles.projectList} ${styles[colorMode]}`}>
      <div className={styles.projectsGrid}>
        {
          projects[currentPage].map((project) => (
            <ProjectCard
              key={project.name}
              description={project.description}
              links={project.links}
              name={project.name}
            />
          ))
        }
      </div>

      {projects.length > 1 && (
        <div className={styles.pagination}>
          <span
            className={`${styles.paginationArrow} ${currentPage === 0 ? styles.disabled : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setCurrentPage((prev) => Math.max(0, prev - 1));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setCurrentPage((prev) => Math.max(0, prev - 1));
              }
            }}
          >
            ←
          </span>

          {projects.map((_, index) => (
            <span
              key={`page-${String(index)}`}
              className={`${styles.paginationNumber} ${currentPage === index ? styles.active : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => {
                setCurrentPage(index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setCurrentPage((prev) => Math.max(0, prev - 1));
                }
              }}
            >
              {index + 1}
            </span>
          ))}

          <span
            className={`${styles.paginationArrow} ${currentPage === projects.length - 1 ? styles.disabled : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setCurrentPage((prev) => Math.min(projects.length - 1, prev + 1));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setCurrentPage((prev) => Math.min(projects.length - 1, prev + 1));
              }
            }}
          >
            →
          </span>
        </div>
      )}

      <div className={styles.actionCardContainer}>
        <ActionCard
          buttonText="Join our Discord"
          buttonUrl="https://discord.gg/9XwESXtcN7"
          description="Are you using TLSNotary in your project? Reach out on Discord and tell us about your work!"
          title="Share what you're building with TLSNotary"
        />
      </div>

      {/* <div className={styles.actionCardContainer}>
        <ActionCard
          buttonText="Submit your project"
          buttonUrl="https://github.com/tlsnotary/landing-page/issues/new?title=Add+a+Project+to+the+Projects+Showcase"
          description="Submit your project to this page."
          title="Are we missing your project?"
        />
      </div> */}
    </div>
  );
};

export default ProjectList;
