import styles from './JoinUs.module.css';

const JoinUs = () => {
  return (
    <section className={styles.joinSection}>
      <h2 className={styles.joinTitle}>
        Join Our Team
      </h2>
      <p className={styles.joinText}>
        We are always looking for talented and motivated individuals to join our research group.
        If you are interested in System 2 deep learning, large language model reasoning, or related areas,
        please feel free to reach out.
      </p>
      <p className={styles.joinText}>
        <strong>Open Positions:</strong> PhD and Master&apos;s students, Postdoctoral researchers
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
