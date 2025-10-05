import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 className={styles.footerTitle}>KU SYSTEM 2 ML LAB</h3>
          <p className={styles.footerText}>
            School of Electrical Engineering, Korea University
          </p>
          <p className={styles.footerAddress}>
            Student Lab: Engineering Hall 238, Professor Office: Engineering Hall 501<br/>
            145 Anam-ro, Seongbuk-gu, Seoul 02841, Republic of Korea
          </p>
          <p className={styles.footerText}>
            <a href="mailto:haebeomlee@korea.ac.kr" className={styles.footerLink}>
              haebeomlee@korea.ac.kr
            </a>
          </p>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 KU System 2 ML Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
