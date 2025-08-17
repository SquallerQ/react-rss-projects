'use client';

import React, { JSX } from 'react';
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

function About(): JSX.Element {
  const t = useTranslations('About');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.text}>
        {t('author')}{' '}
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
          {t('course')}
        </a>
      </p>
    </div>
  );
}

export default About;
