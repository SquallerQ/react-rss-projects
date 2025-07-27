import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default NotFound;
