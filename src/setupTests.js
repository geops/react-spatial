/* eslint-disable import/no-extraneous-dependencies */
import 'jest-canvas-mock';

global.URL.createObjectURL = jest.fn(() => 'fooblob');
