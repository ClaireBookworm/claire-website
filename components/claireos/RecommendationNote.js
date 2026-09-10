import ReactMarkdown from 'react-markdown';
import options from '../../lib/recommendationMarkdown';
import styles from './RecommendationNote.module.css';

export default function RecommendationNote({ children, className = '' }) {
  return <ReactMarkdown {...options} className={`${styles.prose} ${className}`}>{children || ''}</ReactMarkdown>;
}
