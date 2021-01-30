import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
    ${normalize}

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      }

    html,
    body {
        background: ${({ theme }) => theme.color.body};
        color: ${({ theme }) => theme.color.text};
    }
`;