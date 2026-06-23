import { h } from 'preact';
import styles from './formStyles.module.css';

interface TextInputProps {
  value: string;
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  isError: boolean;
  handleChange: (value: string) => void;
}

export const TextInput = ({
  value,
  label,
  placeholder,
  helperText,
  errorMessage,
  isError,
  handleChange,
}: TextInputProps) => {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        placeholder={placeholder}
        onInput={(event) => {
          handleChange(event.currentTarget.value);
        }}
        value={value}
      />
      <span className={isError ? styles.errorText : styles.helperText}>
        {isError ? errorMessage : helperText}
      </span>
    </label>
  );
};
