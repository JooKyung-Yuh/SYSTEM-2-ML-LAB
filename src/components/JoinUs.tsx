import styles from './JoinUs.module.css';

const JoinUs = () => {
  return (
    <section className={styles.joinSection}>
      <h2 className={styles.joinTitle}>
        Join Our Team
      </h2>
      <p className={styles.joinText}>
        We are looking for self-motivated students from diverse backgrounds (EE, CS, Mathematics)
        who are passionate about advancing AI research.
      </p>
      <div className={styles.joinText}>
        <strong>Open Positions:</strong>
        <ul className={styles.positionList}>
          <li><strong>Undergraduate Interns:</strong> Enthusiasm and curiosity are valued over background. We recommend a minimum 3-month internship period.</li>
          <li><strong>Master&apos;s Students:</strong> Expected to have an AI/ML background through internship experience or strong coursework.</li>
          <li><strong>PhD Students:</strong> Expected to have at least one first-authored publication at a top-tier ML conference (NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ICCV, etc.).</li>
          <li><strong>Postdoctoral Researchers:</strong> Please inquire directly with your CV and research statement.</li>
        </ul>
      </div>
      <p className={styles.joinText}>
        We recommend completing an internship (3+ months) before applying for graduate positions.
      </p>
      <p className={styles.joinContact}>
        <strong>Contact:</strong>{' '}
        <a href="mailto:haebeomlee@korea.ac.kr" className={styles.joinLink}>
          haebeomlee@korea.ac.kr
        </a>
      </p>
    </section>
  );
};

export default JoinUs;
