import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './formStyles.module.css';

interface PasswordInputProps {
  value: string;
  label: string;
  helperText: string;
  isInvalid?: boolean;
  placeholder: string;
  handleChange: (value: string) => void;
}

export const PasswordInput = ({
  value,
  label,
  helperText,
  isInvalid,
  placeholder,
  handleChange,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.passwordRow}>
        <input
          className={styles.input}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onInput={(event) => {
            handleChange(event.currentTarget.value);
          }}
        />
        <button
          className={styles.inlineButton}
          type="button"
          onClick={() => {
            setShow((next) => !next);
          }}
        >
          {show ? '隐藏' : '显示'}
        </button>
      </span>
      <span className={isInvalid ? styles.errorText : styles.helperText}>{helperText}</span>
    </label>
  );
};
