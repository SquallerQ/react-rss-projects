import React, { JSX } from 'react';
import Link from 'next/link';
import styles from './NotFound.module.css';

function NotFound(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p> Sorry, the page you are looking for does not exist. </p>
      <Link href="/" className={styles.link}>
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
