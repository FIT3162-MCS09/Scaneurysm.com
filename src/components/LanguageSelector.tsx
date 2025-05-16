import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'ms', name: 'Bahasa Melayu' },
        { code: 'zh', name: '中文' },
        { code: 'ta', name: 'தமிழ்' },
        { code: 'id', name: 'Bahasa Indonesia' }
    ];

    const getCurrentLanguageName = () => {
        return languages.find(lang => lang.code === i18n.language)?.name || 'English';
    };

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code).then(() => {
            window.location.reload();
        });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div
                className={`dropdown-header ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{getCurrentLanguageName()}</span>
                <span className="dropdown-arrow"></span>
            </div>
            {isOpen && (
                <div className="dropdown-options">
                    {languages.map(({ code, name }) => (
                        <div
                            key={code}
                            className={`dropdown-option ${code === i18n.language ? 'selected' : ''}`}
                            onClick={() => handleLanguageChange(code)}
                        >
                            {name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;