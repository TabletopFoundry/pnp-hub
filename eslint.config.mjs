import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [{ ignores: ['coverage/**', '.next/**', 'website/.docusaurus/**', 'website/build/**'] }, ...nextVitals, ...nextTypescript];

export default config;
