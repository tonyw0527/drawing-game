import { DefaultTheme } from 'styled-components';

// lightTheme
const lightTheme: DefaultTheme = {
    mode: 'light',
    mode_img: './sun.svg',

    color: {
        body: '#E2E2E2',
        text: '#363537',
    }
}

// darkTheme
const darkTheme: DefaultTheme = {
    mode: 'dark',
    mode_img: './moon.svg',

    color: {
        body: '#363537',
        text: '#FAFAFA',
    }
}

export { lightTheme, darkTheme };