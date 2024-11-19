import React from "react";
import '@testing-library/jest-dom/extend-expect';

// Mocking react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { changeLanguage: jest.fn() }
    }),
    I18nextProvider: ({ children }) => <>{children}</>
}));

const mockAuthContext = {
    currentToken: 'mockToken',
    currentUser: { role: 'EMPLOYEUR' }
};

afterEach(() => {
    jest.resetAllMocks();
});

describe('ModifierOffreStage Component', () => {

})