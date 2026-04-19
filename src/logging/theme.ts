// theme for inquirer
import ansis from "ansis";
import type { Theme } from "@inquirer/core";

// https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input#Theming
type ThemeInput = {
  prefix: string | { idle: string; done: string };
  spinner: {
    interval: number;
    frames: string[];
  };
  style: {
    answer: (text: string) => string;
    message: (text: string, status: 'idle' | 'done' | 'loading') => string;
    error: (text: string) => string;
    defaultAnswer: (text: string) => string;
  };
  validationFailureMode: 'keep' | 'clear';
};



export const questionTheme: ThemeInput = {
  prefix: {
    idle: `${ansis.bgCyan.black.bold` QUESTION `}`,
    done: `${ansis.bgGreen.white.bold` ANSWERED `}`,
  },
  style: {
    message: (text, status) => {
      if (status === 'idle') {
        return `${ansis.cyan`${text}`}`;
      } else if (status === 'done') {
        return `${ansis.green`${text}`}`;
      } else if (status === 'loading') {
        return `${ansis.yellow`${text}`}`;
      } else {
        return text;
      }
    },
    answer: (text) => `${ansis.green.bold`${text}`}`,
    error: (text) => `${ansis.red.bold`${text}`}`,
    defaultAnswer: (text) => `${ansis.dim`${text}`}`,
  },
  spinner: {
    interval: 100,
    frames: ['⣾', '⣷', '⣯', '⣟', '⣻', '⣽', '⣾'],
  },
  validationFailureMode: 'keep'
};

export const filePickerTheme: Theme = {
  prefix: {
    idle: `${ansis.bgBlue.white.bold` FILE     `}`,
    done: `${ansis.bgGreen.white.bold` SELECTED `}`,
  },
  style: {
    message: (text, status) => {
      if (status === 'idle') {
        return `${ansis.blue`${text}`}`;
      } else if (status === 'done') {
        return `${ansis.green`${text}`}`;
      } else if (status === 'loading') {
        return `${ansis.yellow`${text}`}`;
      } else {
        return text;
      }
    },
    answer: (text) => `${ansis.green.bold`${text}`}`,
    error: (text) => `${ansis.red.bold`${text}`}`,
    defaultAnswer: (text) => `${ansis.dim`${text}`}`,
    help: (text) => `${ansis.dim`${text}`}`,
    highlight: (text) => `${ansis.cyan.bold`${text}`}`,
    key: (text) => `${ansis.yellow.bold`${text}`}`,
  },
  spinner: {
    interval: 100,
    frames: ['⣾', '⣷', '⣯', '⣟', '⣻', '⣽', '⣾'],
  }
};