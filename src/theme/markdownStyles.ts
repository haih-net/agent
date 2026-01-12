import { css } from 'styled-components'

export const markdownStyles = css`
  /* Headings */
  h1 {
    font-size: 2em;
    margin: 1em 0;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
    margin: 1em 0;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.25em;
    margin: 1em 0;
  }

  h4,
  h5,
  h6 {
    margin: 1em 0;
    font-weight: 600;
  }

  /* Paragraphs */
  p {
    margin: 1em 0;
  }

  /* Lists */
  ul,
  ol {
    padding-left: 2em;
    margin: 1em 0;
  }

  li + li {
    margin-top: 0.25em;
  }

  /* Blockquotes */
  blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid #ccc;
    color: #555;
    background: #f9f9f9;
  }

  /* Inline and block code */
  code {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    font-family: monospace;
    border-radius: 4px;
    font-size: 0.95em;
  }

  pre {
    background-color: #f3f4f6;
    padding: 1em;
    overflow-x: auto;
    border-radius: 6px;
    margin: 1em 0;
  }

  pre code {
    background: none;
    padding: 0;
    font-size: 0.95em;
  }

  /* Links */
  a {
    color: #0366d6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    /* margin: 1em 0; */
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
    vertical-align: top;
  }

  thead {
    background: #f6f8fa;
  }
`
