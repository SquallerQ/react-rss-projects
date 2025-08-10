import React, { JSX } from 'react';
import styles from './About.module.css';

function About(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.text}>
        Author:{' '}
        <a
          href="https://github.com/SquallerQ"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Squaller
        </a>
      </p>
      <p className={styles.text}>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          RS School React Course
        </a>
      </p>
    </div>
  );
}

export default About;
