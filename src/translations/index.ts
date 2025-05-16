import { patientSignup } from './pages/patient-signup';
import { dashboard } from './pages/dashboard';
import { about } from './pages/About';
import { aboutAneurysm } from './pages/AboutAneurysm';
import { aboutModel } from './pages/AboutModel';
import { login } from './pages/Login';
import { patientProfile } from './pages/PatientProfile';

export const resources = {
    en: {
        about: about.en,
        aboutAneurysm: aboutAneurysm.en,
        aboutModel: aboutModel.en,
        login: login.en,
        patientProfile: patientProfile.en,
        patientSignup: patientSignup.en,
        dashboard: dashboard.en
    },
    es: {
        about: about.es,
        aboutAneurysm: aboutAneurysm.es,
        aboutModel: aboutModel.es,
        login: login.es,
        patientProfile: patientProfile.es,
        patientSignup: patientSignup.es,
        dashboard: dashboard.es
    },
    ms: {
        about: about.ms,
        aboutAneurysm: aboutAneurysm.ms,
        // aboutModel: aboutModel.ms,
        login: login.ms,
        patientProfile: patientProfile.ms,
        patientSignup: patientSignup.ms,
        dashboard: dashboard.ms
    },
    zh: {
        about: about.zh,
        aboutAneurysm: aboutAneurysm.zh,
        // aboutModel: aboutModel.zh,
        login: login.zh,
        patientProfile: patientProfile.zh,
        patientSignup: patientSignup.zh,
        dashboard: dashboard.zh
    },
    ta: {
        about: about.ta,
        aboutAneurysm: aboutAneurysm.ta,
        // aboutModel: aboutModel.ta,
        login: login.ta,
        patientProfile: patientProfile.ta,
        patientSignup: patientSignup.ta,
        dashboard: dashboard.ta
    },
    id: {
        about: about.id,
        aboutAneurysm: aboutAneurysm.id,
        // aboutModel: aboutModel.id,
        login: login.id,
        patientProfile: patientProfile.id,
        patientSignup: patientSignup.id,
        dashboard: dashboard.id
    }
};