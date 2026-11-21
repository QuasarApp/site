// QuasarApp Group - English translations
const translations = {
    en: {
        nav: {
            home: 'Home',
            projects: 'Projects',
            about: 'About',
            contact: 'Contact'
        },
        hero: {
            subtitle: 'Building the Future of Software',
            explore: 'Explore Projects',
            learn: 'Learn More'
        },
        projects: {
            title: 'Our Projects',
            cqtdeployer: 'Powerful tool for deploying cross-platform Qt applications',
            platforms: 'Platform abstraction layer for cross-platform development',
            opensimplex2: 'Fast noise implementation for procedural generation',
            qt_secret: 'Encryption library with RSA and AES algorithm support',
            heart: 'QuasarApp Heart - base backend for C++/Qt projects. This library supports work with databases and lightweight network requests.',
            cmake: 'CMake modules for QuasarApp projects',
            sdkmanager_android: 'Wrapper of Android SDK Manager for the Snap Store',
            qml_login_view: 'Simple login window library for QML projects.',
            qt_bignum: 'QtBigInt - Arbitrary-sized integer class for C++ and build system of Qt. Powered by GMP 6.3.0',
            simple_qml_notify: 'Simple QML notification service for QML applications.',
            patronum: 'Extension library for controlling your daemons.',
            hanoi: 'Hanoi Towers Game',
            ecliptica: 'Ecliptica is a space exploration game where you command a space station and terraform planets. Build habitats, manage resources, and lead your crew through deep space challenges.',
            cheat_card: 'CheatCard - cross-platform loyalty and discount card application.',
            your_time_delivery: 'YourTimeDelivery - delivery and logistics management system.'
        },
        verticals: {
            title: 'What We Do',
            gamesTitle: 'Game Development',
            gamesText: 'We build immersive 3D games on Qt Quick 3D - from procedurally generated worlds and dynamic NPC-driven economies to full survival experiences like our flagship title Ecliptica.',
            softwareTitle: 'Open-Source & Enterprise Software',
            softwareText: 'We develop cross-platform desktop, mobile and system software in C++/Qt - deployment tools, backend libraries and enterprise solutions trusted in production.'
        },
        featured: {
            title: 'Featured Projects',
            subtitle: 'The flagship products and open-source tools that define the QuasarApp stack.',
            details: 'View details'
        },
        devlog: {
            title: 'Latest News & Devlog',
            subtitle: 'Development logs, patch notes and engine insights from the Ecliptica workspace.',
            empty: 'No devlog posts yet. Development updates, patch notes and engine insights will appear here as soon as they are published on the devlog.'
        },
        stack: {
            title: 'Technology Stack & Open-Source Footprint',
            text: 'Modern C++23 and Qt 6 across desktop, mobile and games - with a large open-source footprint on GitHub.',
            repos: 'Public repositories',
            stars: 'Total stars',
            source: 'GitHub metrics are cached at build time from the GitHub API. Data is currently unavailable - see the QuasarApp organization on GitHub.',
            updated: 'Updated'
        },
        about: {
            title: 'About Us',
            text: 'QuasarApp is an open-source organization dedicated to creating innovative software solutions. We believe in the power of open collaboration and building tools that empower developers worldwide.',
            text2: 'Our team consists of passionate engineers working on cutting-edge technologies, from desktop frameworks to web applications and game development tools.'
        },
        stats: {
            projects: 'Projects',
            stars: 'Stars',
            contributors: 'Contributors'
        },
        contact: {
            title: 'Get in Touch',
            message: 'Contact us through our official channels - links are available in the footer.'
        },
        footer: {
            github: 'GitHub',
            bluesky: 'Bluesky',
            email: 'Email',
            youtube: 'YouTube',
            steam: 'Steam',
            copyright: '© 2026 QuasarApp Group. All rights reserved.'
        },
        aria: {
            toggleLanguage: 'Toggle language'
        },
        ecliptica: {
            title: "Ecliptica",
            subtitle: "Command a Space Station. Terraform Planets. Build Your Empire.",
            description: "A 3D Open-World Survival & Economy Simulation built on Qt Quick 3D",
            feature1: "Procedurally Generated Open World",
            feature2: "Dynamic NPC-Driven Economy",
            feature3: "Settlement Construction",
            feature4: "Corporations & Factions",
            hero: {
                videoPlaceholder: "Gameplay video coming soon"
            },
            cta: {
                wishlist: "Add to Wishlist on Steam",
                demo: "Play Demo / Itch.io"
            },
            mechanics: {
                title: "Core Mechanics",
                tab1: "Open World",
                tab2: "Economy",
                tab3: "Construction",
                tab4: "Corporations",
                content1: {
                    title: "Procedurally Generated Open World & Terrain Deformation",
                    desc: "Experience a vast, ever-changing universe. Every planet, terrain feature, and resource distribution is generated procedurally.",
                    badge: "Interactive Preview"
                },
                content2: {
                    title: "Fully Dynamic NPC-Driven Economy",
                    desc: "Step into a living, breathing economic ecosystem. Trade resources and negotiate with AI-controlled corporations.",
                    badge: "Interactive Preview"
                },
                content3: {
                    title: "Settlement Construction, Blueprints & Terminal Systems",
                    desc: "Design and build your own space stations and planetary outposts with our modular construction system.",
                    badge: "Interactive Preview"
                },
                content4: {
                    title: "Player-Managed Corporations & Factions",
                    desc: "Create and lead your own corporations or join existing factions in a complex galactic power struggle.",
                    badge: "Interactive Preview"
                }
            },
            roadmap: {
                title: "Development Roadmap",
                subtitle: "Transparent development tracking - updated regularly",
                completed: "Completed",
                inprogress: "In Progress",
                planned: "Planned",
                status: {
                    completed: "✓",
                    inprogress: "⚡",
                    planned: "○"
                },
                item1: "Core Engine Foundation",
                item2: "Base Procedural Generation System",
                item3: "Space Station Framework",
                item4: "Advanced Terrain Deformation",
                item5: "Dynamic Economy System",
                item6: "Settlement Construction Tools",
                item7: "Player Corporations & Factions",
                item8: "Multiplayer Systems",
                item9: "Advanced AI Systems",
                item10: "Mobile Platform Support"
            },
            requirements: {
                title: "System Requirements",
                col: {
                    platform: "Platform",
                    min: "Minimum",
                    recommended: "Recommended"
                },
                row: {
                    win10: {
                        platform: "Windows 10/11 64-bit",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Windows 10/11 64-bit</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Windows 11 64-bit</li></ul>"
                    },
                    ubuntu: {
                        platform: "Ubuntu Linux 22.04/24.04/25.04",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Ubuntu 22.04 LTS</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Ubuntu 24.04 LTS</li></ul>"
                    }
                }
            },
            community: {
                title: "Join Our Community",
                subtitle: "Connect with fellow explorers, share your ideas, and provide feedback",
                discord: "Discord Server",
                reddit: "r/Ecliptica",
                feedback: "Feedback & Bug Reports"
            },
            gallery: {
                title: "Media Gallery",
                subtitle: "Explore our screenshots and artwork",
                overlay: "View Full Size"
            },
            feedback: {
                title: "Provide Feedback",
                subtitle: "Help us improve Ecliptica by sharing your thoughts",
                label: {
                    name: "Name",
                    email: "Email",
                    type: "Feedback Type",
                    message: "Message"
                },
                option: {
                    feedback: "General Feedback",
                    bug: "Bug Report",
                    feature: "Feature Request",
                    idea: "Idea Suggestion"
                },
                btn: "Submit Feedback"
            }
        }
    },
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
            cqtdeployer: 'Мощный инструмент для переноса кроссплатформенных приложений на Qt',
            platforms: 'Слой абстракции платформы для кроссплатформенной разработки',
            opensimplex2: 'Быстрая реализация шума для процедурной генерации',
            qt_secret: 'Библиотека шифрования с поддержкой RSA и AES алгоритмов',
            heart: 'Сердце QuasarApp - базовый бэкенд для проектов на C++/Qt. Эта библиотека поддерживает работу с базами данных и лёгкими сетевыми запросами.',
            cmake: 'Модули CMake для проектов QuasarApp',
            sdkmanager_android: 'Обёртка менеджера Android SDK для Snap Store',
            qml_login_view: 'Простая библиотека окна входа для проектов на QML.',
            qt_bignum: 'QtBigInt - класс для работы с целыми числами произвольной величины для C++ и системы сборки Qt. Работает на базе GMP 6.3.0',
            simple_qml_notify: 'Простая служба уведомлений QML для QML-приложений.',
            patronum: 'Расширенная библиотека для управления вашими демонами.',
            hanoi: 'Игра "Башни Ханоя"',
            ecliptica: 'Ecliptica - это игра о космических исследованиях, где вы командуете космической станцией и терраформируете планеты. Стройте колонии, управляйте ресурсами и приводите свою команду через вызовы глубокого космоса.',
            cheat_card: 'CheatCard - кроссплатформенное приложение лояльности и дисконтных карт.',
            your_time_delivery: 'YourTimeDelivery - система управления доставкой и логистикой.'
        },
        verticals: {
            title: 'Чем мы занимаемся',
            gamesTitle: 'Разработка игр',
            gamesText: 'Мы создаём захватывающие 3D-игры на Qt Quick 3D — от процедурных миров и динамических экономий, управляемых NPC, до полноценных survival-опытов, таких как наш флагманский проект Ecliptica.',
            softwareTitle: 'Открытое и корпоративное ПО',
            softwareText: 'Мы разрабатываем кроссплатформенное десктопное, мобильное и системное ПО на C++/Qt — инструменты развёртывания, backend-библиотеки и корпоративные решения, проверенные в продакшене.'
        },
        featured: {
            title: 'Ключевые проекты',
            subtitle: 'Флагманские продукты и открытые инструменты, определяющие стек QuasarApp.',
            details: 'Подробнее'
        },
        devlog: {
            title: 'Новости и журнал разработки',
            subtitle: 'Журналы разработки, патч-ноты и технические заметки — прямо из рабочего процесса Ecliptica.',
            empty: 'Записей пока нет. Новости разработки, патч-ноты и технические заметки будут появляться здесь по мере публикации в журнале разработки.'
        },
        stack: {
            title: 'Технологический стек и открытый код',
            text: 'Современный C++23 и Qt 6 для десктопа, мобильных устройств и игр — с большим открытым следом на GitHub.',
            repos: 'Публичных репозиториев',
            stars: 'Всего звёзд',
            source: 'Метрики GitHub кэшируются при сборке из GitHub API. Данные в данный момент недоступны — см. организацию QuasarApp на GitHub.',
            updated: 'Обновлено'
        },
        about: {
            title: 'О нас',
            text: 'QuasarApp — это организация с открытым исходным кодом, посвящённая созданию инновационных программных решений. Мы верим в силу открытого сотрудничества и создания инструментов, которые помогают разработчикам по всему миру.',
            text2: 'Наша команда состоит из увлечённых инженеров, работающих с передовыми технологиями, от десктопных фреймворков до веб-приложений и инструментов для разработки игр.'
        },
        stats: {
            projects: 'Проекты',
            stars: 'Звёзды',
            contributors: 'Вкладчики'
        },
        contact: {
            title: 'Связаться с нами',
            message: 'Свяжитесь с нами через наши официальные каналы — ссылки доступны в подвале.'
        },
        footer: {
            github: 'GitHub',
            bluesky: 'Bluesky',
            email: 'Email',
            youtube: 'YouTube',
            steam: 'Steam',
            copyright: '© 2026 QuasarApp Group. Все права защищены.'
        },
        aria: {
            toggleLanguage: 'Переключить язык'
        },
        ecliptica: {
            title: "Ecliptica",
            subtitle: "Command a Space Station. Terraform Planets. Build Your Empire.",
            description: "A 3D Open-World Survival & Economy Simulation built on Qt Quick 3D",
            feature1: "Procedurally Generated Open World",
            feature2: "Dynamic NPC-Driven Economy",
            feature3: "Settlement Construction",
            feature4: "Corporations & Factions",
            hero: {
                videoPlaceholder: "Gameplay video coming soon"
            },
            cta: {
                wishlist: "Add to Wishlist on Steam",
                demo: "Play Demo / Itch.io"
            },
            mechanics: {
                title: "Core Mechanics",
                tab1: "Open World",
                tab2: "Economy",
                tab3: "Construction",
                tab4: "Corporations",
                content1: {
                    title: "Procedurally Generated Open World & Terrain Deformation",
                    desc: "Experience a vast, ever-changing universe. Every planet, terrain feature, and resource distribution is generated procedurally.",
                    badge: "Interactive Preview"
                },
                content2: {
                    title: "Fully Dynamic NPC-Driven Economy",
                    desc: "Step into a living, breathing economic ecosystem. Trade resources and negotiate with AI-controlled corporations.",
                    badge: "Interactive Preview"
                },
                content3: {
                    title: "Settlement Construction, Blueprints & Terminal Systems",
                    desc: "Design and build your own space stations and planetary outposts with our modular construction system.",
                    badge: "Interactive Preview"
                },
                content4: {
                    title: "Player-Managed Corporations & Factions",
                    desc: "Create and lead your own corporations or join existing factions in a complex galactic power struggle.",
                    badge: "Interactive Preview"
                }
            },
            roadmap: {
                title: "Development Roadmap",
                subtitle: "Transparent development tracking - updated regularly",
                completed: "Completed",
                inprogress: "In Progress",
                planned: "Planned",
                status: {
                    completed: "✓",
                    inprogress: "⚡",
                    planned: "○"
                },
                item1: "Core Engine Foundation",
                item2: "Base Procedural Generation System",
                item3: "Space Station Framework",
                item4: "Advanced Terrain Deformation",
                item5: "Dynamic Economy System",
                item6: "Settlement Construction Tools",
                item7: "Player Corporations & Factions",
                item8: "Multiplayer Systems",
                item9: "Advanced AI Systems",
                item10: "Mobile Platform Support"
            },
            requirements: {
                title: "System Requirements",
                col: {
                    platform: "Platform",
                    min: "Minimum",
                    recommended: "Recommended"
                },
                row: {
                    win10: {
                        platform: "Windows 10/11 64-bit",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Windows 10/11 64-bit</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Windows 11 64-bit</li></ul>"
                    },
                    ubuntu: {
                        platform: "Ubuntu Linux 22.04/24.04/25.04",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Ubuntu 22.04 LTS</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Ubuntu 24.04 LTS</li></ul>"
                    }
                }
            },
            community: {
                title: "Join Our Community",
                subtitle: "Connect with fellow explorers, share your ideas, and provide feedback",
                discord: "Discord Server",
                reddit: "r/Ecliptica",
                feedback: "Feedback & Bug Reports"
            },
            gallery: {
                title: "Media Gallery",
                subtitle: "Explore our screenshots and artwork",
                overlay: "View Full Size"
            },
            feedback: {
                title: "Provide Feedback",
                subtitle: "Help us improve Ecliptica by sharing your thoughts",
                label: {
                    name: "Name",
                    email: "Email",
                    type: "Feedback Type",
                    message: "Message"
                },
                option: {
                    feedback: "General Feedback",
                    bug: "Bug Report",
                    feature: "Feature Request",
                    idea: "Idea Suggestion"
                },
                btn: "Submit Feedback"
            }
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
            cqtdeployer: 'Leistungsstarkes Tool zum Deployment von cross-platform Qt-Anwendungen',
            platforms: 'Plattformabstraktionsschicht für plattformübergreifende Entwicklung',
            opensimplex2: 'Schnelle Noise-Implementierung für prozedurale Generierung',
            qt_secret: 'Verschlüsselungsbibliothek mit Unterstützung für RSA- und AES-Algorithmen',
            heart: 'QuasarApp Heart - die Basis-Backend-Infrastruktur für C++/Qt-Projekte. Diese Bibliothek unterstützt die Arbeit mit Datenbanken und leichten Netzwerkrequests.',
            cmake: 'CMake-Module für QuasarApp-Projekte',
            sdkmanager_android: 'Wrapper für den Android SDK Manager für den Snap Store',
            qml_login_view: 'Einfaches Login-Fenster-Bibliothek für QML-Projekte.',
            qt_bignum: 'QtBigInt - Klasse für Ganzzahlen beliebiger Größe für C++ und Build-System von Qt. Powered by GMP 6.3.0',
            simple_qml_notify: 'Einfacher QML-Benachrichtigungsdienst für QML-Anwendungen.',
            patronum: 'Erweiterungsbibliothek zum Steuern Ihrer Daemonen.',
            hanoi: 'Hanoi-Türme-Spiel',
            ecliptica: 'Ecliptica ist ein Weltraumforschungsspiel, in dem Sie eine Raumstation commandieren und Planeten terraformieren. Bau von Lebensräumen, Ressourcenmanagement und führen Sie Ihre Crew durch Herausforderungen im tiefen Weltraum.',
            cheat_card: 'CheatCard - plattformübergreifende Loyalitäts- und Rabattkarten-Anwendung.',
            your_time_delivery: 'YourTimeDelivery - System für die Verwaltung von Lieferung und Logistik.'
        },
        verticals: {
            title: 'Was wir tun',
            gamesTitle: 'Spieleentwicklung',
            gamesText: 'Wir entwickeln immersive 3D-Spiele auf Qt Quick 3D - von prozedural generierten Welten und dynamischen, von NPC-getriebenen Ökonomien bis zu vollen Survival-Erlebnissen wie unserem Flaggschiff Ecliptica.',
            softwareTitle: 'Open-Source- und Enterprise-Software',
            softwareText: 'Wir entwickeln plattformübergreifende Desktop-, Mobile- und Systemsoftware in C++/Qt - Deployment-Tools, Backend-Bibliotheken und Enterprise-Lösungen, die in Produktion bewährt sind.'
        },
        featured: {
            title: 'Ausgewählte Projekte',
            subtitle: 'Die Flaggschiff-Produkte und Open-Source-Tools, die den QuasarApp-Stack definieren.',
            details: 'Details ansehen'
        },
        devlog: {
            title: 'Neueste News und Devlog',
            subtitle: 'Entwicklungs-Logs, Patch-Notes und Engine-Einblicke direkt aus dem Ecliptica-Entwicklungsalltag.',
            empty: 'Noch keine Devlog-Beiträge. Entwicklungs-Updates, Patch-Notes und Engine-Einblicke erscheinen hier, sobald sie im Devlog veröffentlicht werden.'
        },
        stack: {
            title: 'Technologie-Stack und Open-Source-Fußabdruck',
            text: 'Modernes C++23 und Qt 6 für Desktop, Mobile und Games - mit einem großen Open-Source-Fußabdruck auf GitHub.',
            repos: 'Öffentliche Repositories',
            stars: 'Sterne insgesamt',
            source: 'GitHub-Metriken werden beim Build aus der GitHub-API gecacht. Daten sind derzeit nicht verfügbar - siehe die QuasarApp-Organisation auf GitHub.',
            updated: 'Aktualisiert'
        },
        about: {
            title: 'Über uns',
            text: 'QuasarApp ist eine Open-Source-Organisation, die sich dem Erschaffen innovativer Softwarelösungen widmet. Wir glauben an die Kraft der offenen Zusammenarbeit und an den Aufbau von Werkzeugen, die Entwicklern auf der ganzen Welt Empowerment bieten.',
            text2: 'Unsere Mannschaft besteht aus leidenschaftlichen Ingenieuren, die mit state-of-the-art-Technologien arbeiten, von Desktop-Frameworks bis hin zu Webanwendungen und Spieleentwicklungswerkzeugen.'
        },
        stats: {
            projects: 'Projekte',
            stars: 'Sterne',
            contributors: 'Beiträger'
        },
        contact: {
            title: 'Kontaktieren Sie uns',
            message: 'Kontaktieren Sie uns über unsere offiziellen Kanäle - Links sind im Footer verfügbar.'
        },
        footer: {
            github: 'GitHub',
            bluesky: 'Bluesky',
            email: 'E-Mail',
            youtube: 'YouTube',
            steam: 'Steam',
            copyright: '© 2026 QuasarApp Group. Alle Rechte vorbehalten.'
        },
        aria: {
            toggleLanguage: 'Sprache umschalten'
        },
        ecliptica: {
            title: "Ecliptica",
            subtitle: "Command a Space Station. Terraform Planets. Build Your Empire.",
            description: "A 3D Open-World Survival & Economy Simulation built on Qt Quick 3D",
            feature1: "Procedurally Generated Open World",
            feature2: "Dynamic NPC-Driven Economy",
            feature3: "Settlement Construction",
            feature4: "Corporations & Factions",
            hero: {
                videoPlaceholder: "Gameplay video coming soon"
            },
            cta: {
                wishlist: "Add to Wishlist on Steam",
                demo: "Play Demo / Itch.io"
            },
            mechanics: {
                title: "Core Mechanics",
                tab1: "Open World",
                tab2: "Economy",
                tab3: "Construction",
                tab4: "Corporations",
                content1: {
                    title: "Procedurally Generated Open World & Terrain Deformation",
                    desc: "Experience a vast, ever-changing universe. Every planet, terrain feature, and resource distribution is generated procedurally.",
                    badge: "Interactive Preview"
                },
                content2: {
                    title: "Fully Dynamic NPC-Driven Economy",
                    desc: "Step into a living, breathing economic ecosystem. Trade resources and negotiate with AI-controlled corporations.",
                    badge: "Interactive Preview"
                },
                content3: {
                    title: "Settlement Construction, Blueprints & Terminal Systems",
                    desc: "Design and build your own space stations and planetary outposts with our modular construction system.",
                    badge: "Interactive Preview"
                },
                content4: {
                    title: "Player-Managed Corporations & Factions",
                    desc: "Create and lead your own corporations or join existing factions in a complex galactic power struggle.",
                    badge: "Interactive Preview"
                }
            },
            roadmap: {
                title: "Development Roadmap",
                subtitle: "Transparent development tracking - updated regularly",
                completed: "Completed",
                inprogress: "In Progress",
                planned: "Planned",
                status: {
                    completed: "✓",
                    inprogress: "⚡",
                    planned: "○"
                },
                item1: "Core Engine Foundation",
                item2: "Base Procedural Generation System",
                item3: "Space Station Framework",
                item4: "Advanced Terrain Deformation",
                item5: "Dynamic Economy System",
                item6: "Settlement Construction Tools",
                item7: "Player Corporations & Factions",
                item8: "Multiplayer Systems",
                item9: "Advanced AI Systems",
                item10: "Mobile Platform Support"
            },
            requirements: {
                title: "System Requirements",
                col: {
                    platform: "Platform",
                    min: "Minimum",
                    recommended: "Recommended"
                },
                row: {
                    win10: {
                        platform: "Windows 10/11 64-bit",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Windows 10/11 64-bit</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Windows 11 64-bit</li></ul>"
                    },
                    ubuntu: {
                        platform: "Ubuntu Linux 22.04/24.04/25.04",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Ubuntu 22.04 LTS</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Ubuntu 24.04 LTS</li></ul>"
                    }
                }
            },
            community: {
                title: "Join Our Community",
                subtitle: "Connect with fellow explorers, share your ideas, and provide feedback",
                discord: "Discord Server",
                reddit: "r/Ecliptica",
                feedback: "Feedback & Bug Reports"
            },
            gallery: {
                title: "Media Gallery",
                subtitle: "Explore our screenshots and artwork",
                overlay: "View Full Size"
            },
            feedback: {
                title: "Provide Feedback",
                subtitle: "Help us improve Ecliptica by sharing your thoughts",
                label: {
                    name: "Name",
                    email: "Email",
                    type: "Feedback Type",
                    message: "Message"
                },
                option: {
                    feedback: "General Feedback",
                    bug: "Bug Report",
                    feature: "Feature Request",
                    idea: "Idea Suggestion"
                },
                btn: "Submit Feedback"
            }
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
            cqtdeployer: 'Potente herramienta para el despliegue de aplicaciones multiplataforma con Qt',
            platforms: 'Capa de abstracción de plataforma para desarrollo multiplataforma',
            opensimplex2: 'Implementación rápida de ruido para generación procedural',
            qt_secret: 'Biblioteca de encriptación con soporte para algoritmos RSA y AES',
            heart: 'QuasarApp Heart - backend básico para proyectos en C++/Qt. Esta biblioteca soporta trabajo con bases de datos y peticiones ligeras de red.',
            cmake: 'Módulos CMake para proyectos de QuasarApp',
            sdkmanager_android: 'Wrapper del gestor de SDK de Android para la tienda Snap',
            qml_login_view: 'Biblioteca simple de ventana de inicio de sesión para proyectos QML.',
            qt_bignum: 'QtBigInt - clase para enteros de tamaño arbitrario para C++ y sistema de construcción de Qt. Powered by GMP 6.3.0',
            simple_qml_notify: 'Servicio de notificación QML simple para aplicaciones QML.',
            patronum: 'Biblioteca de extensión para controlar sus demonios.',
            hanoi: 'Juego de Torres de Hanoi',
            ecliptica: 'Ecliptica es un juego de exploración espacial donde comandas una estación espacial y terraformas planetas. Construye hábitats, gestiona recursos y lidera a tu tripulación a través de desafíos en el espacio profundo.',
            cheat_card: 'CheatCard - aplicación multiplataforma de lealtad y tarjetas de descuento.',
            your_time_delivery: 'YourTimeDelivery - sistema de gestión de entregas y logística.'
        },
        verticals: {
            title: 'Qué hacemos',
            gamesTitle: 'Desarrollo de videojuegos',
            gamesText: 'Creamos juegos 3D inmersivos con Qt Quick 3D - desde mundos procedurales y economías dinámicas impulsadas por NPC hasta experiencias de supervivencia completas como nuestro título insignia Ecliptica.',
            softwareTitle: 'Software Open-Source y Empresarial',
            softwareText: 'Desarrollamos software de escritorio, móvil y de sistema multiplataforma con C++/Qt - herramientas de despliegue, bibliotecas de backend y soluciones empresariales probadas en producción.'
        },
        featured: {
            title: 'Proyectos destacados',
            subtitle: 'Los productos insignia y las herramientas open-source que definen el stack de QuasarApp.',
            details: 'Ver detalles'
        },
        devlog: {
            title: 'Últimas noticias y devlog',
            subtitle: 'Registros de desarrollo, notas de parche e insights del motor directos del espacio de trabajo de Ecliptica.',
            empty: 'Aún no hay publicaciones en el devlog. Las noticias de desarrollo, notas de parche e insights del motor aparecerán aquí en cuanto se publiquen en el devlog.'
        },
        stack: {
            title: 'Stack tecnológico y huella open-source',
            text: 'C++23 moderno y Qt 6 en escritorio, móvil y videojuegos - con una gran huella open-source en GitHub.',
            repos: 'Repositorios públicos',
            stars: 'Estrellas totales',
            source: 'Las métricas de GitHub se cachéan en tiempo de compilación desde la API de GitHub. Los datos no están disponibles - ver la organización QuasarApp en GitHub.',
            updated: 'Actualizado'
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
            message: 'Contáctanos a través de nuestros canales oficiales - los enlaces están disponibles en el pie de página.'
        },
        footer: {
            github: 'GitHub',
            bluesky: 'Bluesky',
            email: 'Email',
            youtube: 'YouTube',
            steam: 'Steam',
            copyright: '© 2026 QuasarApp Group. Todos los derechos reservados.'
        },
        aria: {
            toggleLanguage: 'Cambiar idioma'
        },
        ecliptica: {
            title: "Ecliptica",
            subtitle: "Command a Space Station. Terraform Planets. Build Your Empire.",
            description: "A 3D Open-World Survival & Economy Simulation built on Qt Quick 3D",
            feature1: "Procedurally Generated Open World",
            feature2: "Dynamic NPC-Driven Economy",
            feature3: "Settlement Construction",
            feature4: "Corporations & Factions",
            hero: {
                videoPlaceholder: "Gameplay video coming soon"
            },
            cta: {
                wishlist: "Add to Wishlist on Steam",
                demo: "Play Demo / Itch.io"
            },
            mechanics: {
                title: "Core Mechanics",
                tab1: "Open World",
                tab2: "Economy",
                tab3: "Construction",
                tab4: "Corporations",
                content1: {
                    title: "Procedurally Generated Open World & Terrain Deformation",
                    desc: "Experience a vast, ever-changing universe. Every planet, terrain feature, and resource distribution is generated procedurally.",
                    badge: "Interactive Preview"
                },
                content2: {
                    title: "Fully Dynamic NPC-Driven Economy",
                    desc: "Step into a living, breathing economic ecosystem. Trade resources and negotiate with AI-controlled corporations.",
                    badge: "Interactive Preview"
                },
                content3: {
                    title: "Settlement Construction, Blueprints & Terminal Systems",
                    desc: "Design and build your own space stations and planetary outposts with our modular construction system.",
                    badge: "Interactive Preview"
                },
                content4: {
                    title: "Player-Managed Corporations & Factions",
                    desc: "Create and lead your own corporations or join existing factions in a complex galactic power struggle.",
                    badge: "Interactive Preview"
                }
            },
            roadmap: {
                title: "Development Roadmap",
                subtitle: "Transparent development tracking - updated regularly",
                completed: "Completed",
                inprogress: "In Progress",
                planned: "Planned",
                status: {
                    completed: "✓",
                    inprogress: "⚡",
                    planned: "○"
                },
                item1: "Core Engine Foundation",
                item2: "Base Procedural Generation System",
                item3: "Space Station Framework",
                item4: "Advanced Terrain Deformation",
                item5: "Dynamic Economy System",
                item6: "Settlement Construction Tools",
                item7: "Player Corporations & Factions",
                item8: "Multiplayer Systems",
                item9: "Advanced AI Systems",
                item10: "Mobile Platform Support"
            },
            requirements: {
                title: "System Requirements",
                col: {
                    platform: "Platform",
                    min: "Minimum",
                    recommended: "Recommended"
                },
                row: {
                    win10: {
                        platform: "Windows 10/11 64-bit",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Windows 10/11 64-bit</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Windows 11 64-bit</li></ul>"
                    },
                    ubuntu: {
                        platform: "Ubuntu Linux 22.04/24.04/25.04",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Ubuntu 22.04 LTS</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Ubuntu 24.04 LTS</li></ul>"
                    }
                }
            },
            community: {
                title: "Join Our Community",
                subtitle: "Connect with fellow explorers, share your ideas, and provide feedback",
                discord: "Discord Server",
                reddit: "r/Ecliptica",
                feedback: "Feedback & Bug Reports"
            },
            gallery: {
                title: "Media Gallery",
                subtitle: "Explore our screenshots and artwork",
                overlay: "View Full Size"
            },
            feedback: {
                title: "Provide Feedback",
                subtitle: "Help us improve Ecliptica by sharing your thoughts",
                label: {
                    name: "Name",
                    email: "Email",
                    type: "Feedback Type",
                    message: "Message"
                },
                option: {
                    feedback: "General Feedback",
                    bug: "Bug Report",
                    feature: "Feature Request",
                    idea: "Idea Suggestion"
                },
                btn: "Submit Feedback"
            }
        }
    },
    me: {
        nav: {
            home: 'Početna',
            projects: 'Projekti',
            about: 'O nama',
            contact: 'Kontakt'
        },
        hero: {
            subtitle: 'Gradimo budućnost softvera',
            explore: 'Istraži projekte',
            learn: 'Saznaj više'
        },
        projects: {
            title: 'Naši projekti',
            cqtdeployer: 'Moj alat za postavljanje krosplatformskih Qt aplikacija',
            platforms: 'Sloj apstrakcije platformi za krosplatformni razvoj',
            opensimplex2: 'Brza implementacija šuma za proceduralnu generaciju',
            qt_secret: 'Kriptografska biblioteka sa podrškom za RSA i AES algoritme',
            heart: 'QuasarApp Heart - osnovni backend za C++/Qt projekte. Ova biblioteka podržava rad sa bazama podataka i laganim mrežnim zahtjevima.',
            cmake: 'CMake moduli za QuasarApp projekte',
            sdkmanager_android: 'Omotač Android SDK menadžera za Snap Store',
            qml_login_view: 'Jednostavna biblioteka prijavne prozora za QML projekte.',
            qt_bignum: 'QtBigInt - klasa za rad sa cijelim brojevima proizvoljne veličine za C++ i sistem za gradnju Qt. Pokreće GMP 6.3.0',
            simple_qml_notify: 'Jednostavna QML služba za obaveštenja za QML aplikacije.',
            patronum: 'Biblioteka proširenja za upravljanje vašim demonima.',
            hanoi: 'Igra "Kule iz Hanoya"',
            ecliptica: 'Ecliptica je igra o istraživanju svemira u kojoj komandujete svemirskom stanicom i terraformirate planete. Gradite habitate, upravljate resursima i vodite svoju posadu kroz izazove dubokog svemira.',
            cheat_card: 'CheatCard - krosplatformna aplikacija za kartice vjernosti i popuste.',
            your_time_delivery: 'YourTimeDelivery - sistem za upravljanje dostavom i logistikom.'
        },
        verticals: {
            title: 'Čime se bavimo',
            gamesTitle: 'Razvoj igara',
            gamesText: 'Gradimo imerzivne 3D igre na Qt Quick 3D - od proceduralnih svjetova i dinamičnih ekonomija vođenih NPC do potpunih survival iskustava poput našeg flagshipskog naslova Ecliptica.',
            softwareTitle: 'Otvoreni i korporativni softver',
            softwareText: 'Razvijamo krosplatformni desktop, mobilni i sistemski softver na C++/Qt - alati za postavljanje, backend biblioteke i korporativna rješenja provjerena u produkciji.'
        },
        featured: {
            title: 'Izdvojeni projekti',
            subtitle: 'Flagship proizvodi i otvoreni alati koji definišu QuasarApp stack.',
            details: 'Pogledaj detalje'
        },
        devlog: {
            title: 'Najnovije vijesti i devlog',
            subtitle: 'Dnevnik razvoja, napomene za patcheve i uvidi u engine - direktno iz radnog procesa Ecliptica.',
            empty: 'Još nema zapisa u devlogu. Vijesti o razvoju, napomene za patcheve i uvidi u engine pojaviće se ovdje čim se objave u devlogu.'
        },
        stack: {
            title: 'Tehnološki stack i otvoreni trag',
            text: 'Moderan C++23 i Qt 6 za desktop, mobilne uređaje i igre - sa velikim otvorenim tragom na GitHub.',
            repos: 'Javnih repozitorijuma',
            stars: 'Ukupno zvijezda',
            source: 'GitHub metrike se keširaju pri gradnji iz GitHub API. Podaci su trenutno nedostupni - pogledajte organizaciju QuasarApp na GitHub.',
            updated: 'Ažurirano'
        },
        about: {
            title: 'O nama',
            text: 'QuasarApp je organizacija otvorenog koda posvećena kreiranju inovativnih softverskih rješenja. Vjerujemo u snagu otvorene saradnje i izgradnje alata koji pomažu developerima širom svijeta.',
            text2: 'Naš tim čine strastveni inženjeri koji rade na najnovijim tehnologijama, od desktop frameworkova do web aplikacija i alata za razvoj igara.'
        },
        stats: {
            projects: 'Projekti',
            stars: 'Zvijezde',
            contributors: 'Doprinosioci'
        },
        contact: {
            title: 'Kontaktirajte nas',
            message: 'Kontaktirajte nas putem naših zvaničnih kanala — linkovi su dostupni u podnožju.'
        },
        footer: {
            github: 'GitHub',
            bluesky: 'Bluesky',
            email: 'E-mail',
            youtube: 'YouTube',
            steam: 'Steam',
            copyright: '© 2026 QuasarApp Group. Sva prava zadržana.'
        },
        aria: {
            toggleLanguage: 'Promijeni jezik'
        },
        ecliptica: {
            title: "Ecliptica",
            subtitle: "Command a Space Station. Terraform Planets. Build Your Empire.",
            description: "A 3D Open-World Survival & Economy Simulation built on Qt Quick 3D",
            feature1: "Procedurally Generated Open World",
            feature2: "Dynamic NPC-Driven Economy",
            feature3: "Settlement Construction",
            feature4: "Corporations & Factions",
            hero: {
                videoPlaceholder: "Gameplay video coming soon"
            },
            cta: {
                wishlist: "Add to Wishlist on Steam",
                demo: "Play Demo / Itch.io"
            },
            mechanics: {
                title: "Core Mechanics",
                tab1: "Open World",
                tab2: "Economy",
                tab3: "Construction",
                tab4: "Corporations",
                content1: {
                    title: "Procedurally Generated Open World & Terrain Deformation",
                    desc: "Experience a vast, ever-changing universe. Every planet, terrain feature, and resource distribution is generated procedurally.",
                    badge: "Interactive Preview"
                },
                content2: {
                    title: "Fully Dynamic NPC-Driven Economy",
                    desc: "Step into a living, breathing economic ecosystem. Trade resources and negotiate with AI-controlled corporations.",
                    badge: "Interactive Preview"
                },
                content3: {
                    title: "Settlement Construction, Blueprints & Terminal Systems",
                    desc: "Design and build your own space stations and planetary outposts with our modular construction system.",
                    badge: "Interactive Preview"
                },
                content4: {
                    title: "Player-Managed Corporations & Factions",
                    desc: "Create and lead your own corporations or join existing factions in a complex galactic power struggle.",
                    badge: "Interactive Preview"
                }
            },
            roadmap: {
                title: "Development Roadmap",
                subtitle: "Transparent development tracking - updated regularly",
                completed: "Completed",
                inprogress: "In Progress",
                planned: "Planned",
                status: {
                    completed: "✓",
                    inprogress: "⚡",
                    planned: "○"
                },
                item1: "Core Engine Foundation",
                item2: "Base Procedural Generation System",
                item3: "Space Station Framework",
                item4: "Advanced Terrain Deformation",
                item5: "Dynamic Economy System",
                item6: "Settlement Construction Tools",
                item7: "Player Corporations & Factions",
                item8: "Multiplayer Systems",
                item9: "Advanced AI Systems",
                item10: "Mobile Platform Support"
            },
            requirements: {
                title: "System Requirements",
                col: {
                    platform: "Platform",
                    min: "Minimum",
                    recommended: "Recommended"
                },
                row: {
                    win10: {
                        platform: "Windows 10/11 64-bit",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Windows 10/11 64-bit</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Windows 11 64-bit</li></ul>"
                    },
                    ubuntu: {
                        platform: "Ubuntu Linux 22.04/24.04/25.04",
                        min: "<ul><li>CPU: Intel Core i5-8400 / AMD Ryzen 5 2600</li><li>RAM: 16 GB</li><li>GPU: NVIDIA GTX 1060 6GB / AMD RX 580</li><li>Storage: 80 GB SSD</li><li>OS: Ubuntu 22.04 LTS</li></ul>",
                        recommended: "<ul><li>CPU: Intel Core i7-10700K / AMD Ryzen 7 5800X</li><li>RAM: 32 GB</li><li>GPU: NVIDIA RTX 3070 / AMD RX 6800 XT</li><li>Storage: 80 GB NVMe SSD</li><li>OS: Ubuntu 24.04 LTS</li></ul>"
                    }
                }
            },
            community: {
                title: "Join Our Community",
                subtitle: "Connect with fellow explorers, share your ideas, and provide feedback",
                discord: "Discord Server",
                reddit: "r/Ecliptica",
                feedback: "Feedback & Bug Reports"
            },
            gallery: {
                title: "Media Gallery",
                subtitle: "Explore our screenshots and artwork",
                overlay: "View Full Size"
            },
            feedback: {
                title: "Provide Feedback",
                subtitle: "Help us improve Ecliptica by sharing your thoughts",
                label: {
                    name: "Name",
                    email: "Email",
                    type: "Feedback Type",
                    message: "Message"
                },
                option: {
                    feedback: "General Feedback",
                    bug: "Bug Report",
                    feature: "Feature Request",
                    idea: "Idea Suggestion"
                },
                btn: "Submit Feedback"
            }
        }
    }
};

let currentLanguage = 'en';

function getStoredLanguage() {
    if (typeof Storage !== 'undefined') {
        try {
            const stored = localStorage.getItem('quasarapp_language');
            const validLanguages = ['en', 'ru', 'me', 'de', 'es'];
            if (stored && validLanguages.includes(stored)) {
                return stored;
            }
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
    return null;
}

function setLanguage(lang) {
    currentLanguage = lang;
    try {
        localStorage.setItem('quasarapp_language', lang);
    } catch (e) {
        console.warn('Failed to save language preference:', e);
    }
}

function getBrowserLanguage() {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    }
    if (navigator.language) {
        return navigator.language;
    }
    return null;
}

function getLanguageFromBrowserCode(browserLang) {
    if (!browserLang) return 'en';
    const langMap = {
        'ru-RU': 'ru',
        'ru': 'ru',
        'me-ME': 'me',
        'me': 'me',
        'de-DE': 'de',
        'de': 'de',
        'es-ES': 'es',
        'es': 'es',
        'en-US': 'en',
        'en-GB': 'en',
        'en': 'en'
    };
    return langMap[browserLang] || 'en';
}

function selectLanguage(lang) {
    const languages = ['en', 'ru', 'me', 'de', 'es'];
    if (!languages.includes(lang)) {
        lang = 'en';
    }
    setLanguage(lang);
    updateTranslations();
    updateLanguageButton();
}

function updateLanguageButton() {
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        const hasOption = Array.prototype.some.call(langSelect.options, (option) => option.value === currentLanguage);
        if (hasOption) {
            langSelect.value = currentLanguage;
        }
        const ariaLabel = translations[currentLanguage]?.aria?.toggleLanguage || 'Toggle language';
        langSelect.setAttribute('aria-label', ariaLabel);
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
        
        if (value && element.textContent !== value) {
            element.textContent = value;
        }
    });
    
    // Update HTML lang attribute
    const html = document.documentElement;
    html.setAttribute('lang', currentLanguage);

    // Notify data renderers (e.g. js/home-data.js) that the active language
    // changed so dynamic content (GitHub metrics line, devlog dates) can be
    // re-localized (issue #78).
    if (typeof document.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        document.dispatchEvent(new CustomEvent('quasarapp:languagechange', {
            detail: { language: currentLanguage },
        }));
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for stored language preference
    let initialLang = getStoredLanguage();
    
    // If no stored preference, use browser language
    if (!initialLang) {
        const browserLang = getBrowserLanguage();
        if (browserLang) {
            const detectedLang = getLanguageFromBrowserCode(browserLang);
            initialLang = detectedLang;
        }
    }
    
    if (initialLang) {
        setLanguage(initialLang);
    } else {
        setLanguage('en');
    }
    
    updateLanguageButton();
    updateTranslations();
    
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
});
