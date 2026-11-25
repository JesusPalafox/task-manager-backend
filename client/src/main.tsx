import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
const element = document.getElementById('root');
if (!element) throw new Error('Elemento #root no encontrado');
createRoot(element).render(<StrictMode><App /></StrictMode>);
