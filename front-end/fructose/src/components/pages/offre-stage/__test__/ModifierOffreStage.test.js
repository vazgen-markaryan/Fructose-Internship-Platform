import React from "react";
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor} from "@testing-library/react";
import {AuthContext} from "../../../providers/AuthProvider";
import {OffreStageContext} from "../../../providers/OffreStageProvider";
import {BrowserRouter as Router} from "react-router-dom";
import ModifierOffreStage from "../ModifierOffreStage";

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

const mockFetchOffreStage = jest.fn();

afterEach(() => {
    jest.resetAllMocks();
});

describe('ModifierOffreStage Component', () => {
    test('Renders without errors', () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <OffreStageContext.Provider value={{}}>
                    <Router>
                        <ModifierOffreStage />
                    </Router>
                </OffreStageContext.Provider>
            </AuthContext.Provider>
        );
        expect(screen.getByText(/modifier_offre_stage_page.title/i)).toBeInTheDocument();
    });

    test('Returns 404 error when not found', async () => {
        // Given
        const mockOffer = null
        mockFetchOffreStage.mockResolvedValue(mockOffer);
        // When
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <OffreStageContext.Provider value={{fetchOffreStage: mockFetchOffreStage}}>
                    <Router>
                        <ModifierOffreStage/>
                    </Router>
                </OffreStageContext.Provider>
            </AuthContext.Provider>
        );
        // Then
        expect(screen.getByText(/Erreur 404/i)).toBeInTheDocument();
    });
})