import styles from './oneui.module.css';

/* eslint-disable-next-line */
export interface OneuiProps {}

export function Oneui(props: OneuiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Oneui!</h1>
    </div>
  );
}

export default Oneui;
