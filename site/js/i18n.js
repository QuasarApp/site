// QuasarApp Group - English translations
const translations = {
    ru: {
        nav: {
            home: 'Главная',
            projects: 'Проекты',
            about: 'О нас',
            contact: 'Контакты'
        },
        hero: {
            subtitle: 'Создаём будущее программного обеспечения',
            explore: 'Исследовать проекты',
            learn: 'Узнать больше'
        },
        projects: {
            title: 'Наши проекты',
            quasarapp: {
                desc: 'Мощный фреймворк для создания кроссплатформенных десктопных приложений на Qt'
            },
            platforms: {
                desc: 'Слой абстракции платформы для кроссплатформенной разработки'
            },
            opensimplex2: {
                desc: 'Быстрая реализация шума для процедурной генерации'
            },
            quasar_framework: {
                desc: 'Полнофункциональный веб-фреймворк на Vue.js'
            }
        },
        about: {
            title: 'О нас',
            text: 'QuasarApp - это организация с открытым исходным кодом, посвящённая созданию инновационных программных решений. Мы верим в силу открытого сотрудничества и создания инструментов, которые помогают разработчикам по всему миру.',
            text2: 'Наша команда состоит из увлечённых инженеров, работающих передовыми технологиями, от десктопных фреймворков до веб-приложений и инструментов для разработки игр.'
        },
        stats: {
            projects: 'Проекты',
            stars: 'Звёзд',
            contributors: 'Вкладчики'
        },
        contact: {
            title: 'Связаться с нами',
            github: 'GitHub',
            twitter: 'Twitter',
            email: 'Email'
        }
    },
    de: {
        nav: {
            home: 'Startseite',
            projects: 'Projekte',
            about: 'Über uns',
            contact: 'Kontakt'
        },
        hero: {
            subtitle: 'Die Zukunft der Software gestalten',
            explore: 'Projekte entdecken',
            learn: 'Mehr erfahren'
        },
        projects: {
            title: 'Unsere Projekte',
            quasarapp: {
                desc: 'Ein leistungsfähiger Framework zur Erstellung von plattformübergreifenden Desktop-Anwendungen mit Qt'
            },
            platforms: {
                desc: 'Plattformabstraktionsschicht für plattformübergreifende Entwicklung'
            },
            opensimplex2: {
                desc: 'Schnelle Noise-Implementierung für prozedurale Generierung'
            },
            quasar_framework: {
                desc: 'Full-Stack Web-Framework mit Vue.js'
            }
        },
        about: {
            title: 'Über uns',
            text: 'QuasarApp ist eine Open-Source-Organisation, die sich der Erstellung innovativer Softwarelösungen widmet. Wir glauben an die Kraft der offenen Zusammenarbeit und an Werkzeuge, die Entwicklern auf der ganzen Welt empower.',
            text2: 'Unser Team besteht aus leidenschaftlichen Ingenieuren, die an modernsten Technologien arbeiten - von Desktop-Frameworks bis hin zu Web-Anwendungen und Spielentwicklungs-Tools.'
        },
        stats: {
            projects: 'Projekte',
            stars: 'Sterne',
            contributors: 'Mitwirkende'
        },
        contact: {
            title: 'Kontakt aufnehmen',
            github: 'GitHub',
            twitter: 'Twitter',
            email: 'Email'
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            projects: 'Proyectos',
            about: 'Sobre nosotros',
            contact: 'Contacto'
        },
        hero: {
            subtitle: 'Construyendo el futuro del software',
            explore: 'Explorar proyectos',
            learn: 'Aprende más'
        },
        projects: {
            title: 'Nuestros proyectos',
            quasarapp: {
                desc: 'Un marco de trabajo potente para crear aplicaciones de escritorio multiplataforma con Qt'
            },
            platforms: {
                desc: 'Capa de abstracción de plataforma para desarrollo multiplataforma'
            },
            opensimplex2: {
                desc: 'Implementación rápida de ruido para generación procedural'
            },
            quasar_framework: {
                desc: 'Marco web Full-Stack con Vue.js'
            }
        },
        about: {
            title: 'Sobre nosotros',
            text: 'QuasarApp es una organización de código abierto dedicada a crear soluciones de software innovadoras. Creemos en el poder de la colaboración abierta y en la creación de herramientas que empoderan a desarrolladores de todo el mundo.',
            text2: 'Nuestro equipo consiste en ingenieros apasionados que trabajan con tecnologías de vanguardia, desde marcos de escritorio hasta aplicaciones web y herramientas de desarrollo de juegos.'
        },
        stats: {
            projects: 'Proyectos',
            stars: 'Estrellas',
            contributors: 'Colaboradores'
        },
        contact: {
            title: 'Contáctanos',
            github: 'GitHub',
            twitter: 'Twitter',
            email: 'Email'
        }
    }
};

let currentLanguage = 'en';

function toggleLanguage() {
    const languages = ['en', 'ru', 'de', 'es'];
    const currentIndex = languages.indexOf(currentLanguage);
    currentLanguage = languages[(currentIndex + 1) % languages.length];
    updateTranslations();
    updateLanguageButton();
}

function updateLanguageButton() {
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.innerHTML = '<i class="fas fa-globe"></i> ' + currentLanguage.toUpperCase();
    }
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const lang = element.getAttribute('data-lang');
        const keys = lang.split('.');
        let value = translations[currentLanguage];
        
        for (const key of keys) {
            value = value ? value[key] : null;
            if (!value) break;
        }
        
        if (value) {
            element.textContent = value;
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLanguageButton();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add parallax effect to cards
    if (window.ParallaxHandler) {
        window.ParallaxHandler.init();
    }
});