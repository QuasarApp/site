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
            text: 'Explore our open-source projects and tools.',
            empty: 'No projects available at the moment.',
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
        projectsDetail: {
            backToCatalog: 'Back to all projects',
            platformsLabel: 'Supported platforms',
            problemTitle: 'The Problem',
            valueTitle: 'Why It Matters',
            featuresTitle: 'Features',
            stackTitle: 'Technology Stack',
            mediaTitle: 'Media & Downloads',
            githubTitle: 'Open Source on GitHub',
            noGithubTitle: 'No Public Repository',
            githubStars: 'Stars on GitHub',
            githubLatestRelease: 'Latest release',
            githubCached: 'GitHub data is cached at build time from the GitHub API - the values shown are from the last successful fetch.',
            githubUpdated: 'Updated',
            githubArchived: 'This repository is archived and is now read-only.',
            githubNoRelease: 'No public releases',
            mediaEmpty: 'Screenshots and demo videos will appear here as soon as the project ships public media.',
            mediaCaptionKeyArt: 'Official key art (Steam capsule)',
            mediaCaptionEnvironment: 'Environment & world art',
            btnSteam: 'Play on Steam',
            btnWishlist: 'Add to Wishlist',
            btnDownload: 'Download',
            btnGithub: 'View on GitHub',
            btnDocs: 'Documentation',
            btnContact: 'Contact the team',
            btnEclipticaHub: 'Visit the Ecliptica hub',
            categories: {
                games: 'Games',
                developerTools: 'Developer Tools',
                desktopApps: 'Desktop & Mobile Apps',
                libraries: 'Libraries'
            },
            statuses: {
                activeDevelopment: 'Active Development',
                released: 'Released',
                openSource: 'Open Source',
                beta: 'Beta'
            },
            ecliptica: {
                problem: 'Survival games and economy sims rarely meet: open-world crafting without a living economy, or strategy without a world you can walk through. Ecliptica closes that gap on a modern cross-platform engine.',
                value: 'A 3D open-world survival & economy sim built on Qt Quick 3D. You command the final space station, terraform distant planets and watch a fully dynamic, NPC-driven economy react to every decision you make.',
                feature1: 'Procedurally generated open worlds with deformable terrain',
                feature2: 'Fully dynamic, NPC-driven economy',
                feature3: 'Settlement construction with blueprints and terminal systems',
                feature4: 'Player-managed corporations and factions',
                githubNote: 'Ecliptica is a commercial Steam game. The public repository hosts the game\u2019s official web page, not the game code.'
            },
            cqtdeployer: {
                problem: 'Shipping a Qt/QML application means chasing platform-specific DLLs, Qt modules and plugins on every operating system - slow, manual and error-prone.',
                value: 'CQtDeployer automates cross-platform deployment for QML, Qt and other C/C++ applications: one tool that collects the right binaries, modules and plugins for your target platform.',
                feature1: 'One-click deployment for QML and Qt/C++ applications',
                feature2: 'Targets Windows, Linux and macOS from a single workflow',
                feature3: 'Automatic detection of required Qt modules and plugins',
                feature4: 'Command-line interface for CI/CD pipelines'
            },
            cheatcard: {
                problem: 'Loyalty and discount programs live on paper or in siloed apps, so small businesses struggle to run card programs and customers lose track of their benefits.',
                value: 'CheatCard is a cross-platform loyalty and discount card application: customers carry every card in one place, and businesses run discount and loyalty programs without building custom software.',
                feature1: 'Digital loyalty and discount cards in one wallet',
                feature2: 'Cross-platform Qt/QML client',
                feature3: 'Discount and loyalty program management',
                feature4: 'Built on the QuasarApp C++/Qt stack'
            },
            yourtimedelivery: {
                noRepo: 'YourTimeDelivery is a commercial product and has no public repository. Contact the team for a demo, licensing or a custom deployment.',
                problem: 'Small delivery operations lose time in phone calls, spreadsheets and paper routes: dispatch, route planning and customer updates run on tools that do not talk to each other.',
                value: 'YourTimeDelivery is a delivery and logistics management system that keeps dispatch, route planning and delivery status in one cross-platform application.',
                feature1: 'Dispatch and route planning in a single workflow',
                feature2: 'Delivery status tracking across the whole fleet',
                feature3: 'Cross-platform desktop and mobile clients'
            },
            qtssecret: {
                problem: 'Adding cryptography to a C++/Qt project usually means integrating a raw C library: manual contexts, key handling and platform quirks in your own code.',
                value: 'Qt-Secret is a simple C++ encryption library with first-class RSA and AES support, designed to drop straight into Qt applications.',
                feature1: 'RSA and AES algorithms out of the box',
                feature2: 'Simple C++ API shaped for Qt projects',
                feature3: 'CMake-based integration for existing builds'
            },
            heart: {
                problem: 'Every C++/Qt project re-invents the same plumbing: database access, lightweight network requests and shared backend primitives.',
                value: 'Heart is the base backend library for C++/Qt projects - one dependency for database work and lightweight network requests, battle-tested across the QuasarApp toolset.',
                feature1: 'Database access layer for C++/Qt applications',
                feature2: 'Lightweight network request utilities',
                feature3: 'Shared backend primitives for the QuasarApp ecosystem'
            }
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
            description: 'Our mission is to build high-quality software that helps developers and organizations succeed.',
            text2: 'Our team consists of passionate engineers working on cutting-edge technologies, from desktop frameworks to web applications and game development tools.'
        },
        aboutPage: {
            backToHome: 'Back to home',
            badgeStudio: 'Software & Game Studio',
            badgeB2b: 'B2B Services',
            location: 'Bar, Montenegro',
            backgroundTitle: 'The Studio',
            background1: 'QuasarApp Group d.o.o. is a high-tech software and game development studio based in Bar, Montenegro.',
            background2: 'We specialize in C++/Qt/QML engineering, cross-platform solutions and 3D engines - from system software and developer tools to our flagship 3D open-world title, Ecliptica.',
            background3: 'The studio combines a large open-source footprint with B2B services for companies that need production-grade C++/Qt expertise.',
            metricsNote: 'Open-source footprint: repositories and stars are cached at build time from the GitHub API.',
            competenciesTitle: 'Team Competencies',
            competenciesSubtitle: 'The engineering disciplines the team works with every day.',
            cpp23Title: 'C++23',
            cpp23Text: 'Modern C++23 codebases with strict warning policies, heavy templates and performance-critical design.',
            qtqmlTitle: 'Qt/QML',
            qtqmlText: 'Qt 6 and QML application development - declarative UIs, 3D with Qt Quick 3D, and native platform integration.',
            cicdTitle: 'CI/CD',
            cicdText: 'Automated build, test and release pipelines on GitHub Actions across Linux, Windows and Android targets.',
            deploymentTitle: 'Cross-platform deployment',
            deploymentText: 'Packaging, distribution and deployment of C++/Qt applications for desktop and mobile platforms.',
            servicesTitle: 'B2B Services',
            servicesSubtitle: 'Clear, structured engagements for companies and partners.',
            outsourcingTitle: 'Outsourcing',
            outsourcingText: 'Dedicated C++/Qt engineering capacity: your product team gets senior developers who ship production software.',
            consultingTitle: 'Consulting',
            consultingText: 'Architecture reviews, technology selection and code audits for C++/Qt/QML products - from prototypes to enterprise systems.',
            portingTitle: 'Platform porting',
            portingText: 'Porting and adapting existing applications to new platforms and operating systems, from Linux desktop to Android and Windows.',
            ctaTitle: 'Work with us',
            ctaText: 'Have a C++/Qt project, a port or a product in mind? Tell us about it.',
            ctaButton: 'Get in touch'
        },
        stats: {
            projects: 'Projects',
            stars: 'Stars',
            contributors: 'Contributors'
        },
        contact: {
            title: 'Get in Touch',
            text: 'Get in touch with us.',
            email: 'Email',
            github: 'GitHub',
            message: 'Contact us through our official channels - links are available in the footer.',
            page: 'Contact page'
        },
        contacts: {
            title: 'Contacts',
            lead: 'Get in touch with QuasarApp Group — business inquiries, press, partnerships or support.',
            formHeading: 'Send us a message',
            formText: 'Fill in the form and we will get back to you. Messages are protected by anti-spam validation.',
            name: 'Your name',
            namePlaceholder: 'Jane Doe',
            email: 'Email',
            emailPlaceholder: 'jane@example.com',
            message: 'Message',
            messagePlaceholder: 'Tell us about your project or question…',
            send: 'Send message',
            sending: 'Sending…',
            success: 'Thank you! Your message has been sent — we will get back to you soon.',
            fallbackSuccess: 'Your email client has been opened with your message pre-filled. Press Send in the email app to deliver it.',
            error: 'Something went wrong while sending your message. Please try again or write to us directly by email.',
            rateLimited: 'Too many messages were sent recently. Please try again later or write to us directly by email.',
            fallbackNotice: 'Direct form submission is not enabled yet. Submitting opens your email client with the message pre-filled — press Send there to deliver it.',
            directEmail: 'Prefer email?',
            directEmailText: 'Write to us directly at quasarappdevelop@gmail.com and we will get back to you.',
            errName: 'Please enter your name (at least 2 characters).',
            errEmail: 'Please enter a valid email address.',
            errMessage: 'Please enter a message of at least 10 characters.',
            linksHeading: 'Official channels',
            linksText: 'Reach and follow QuasarApp on its official platforms.',
            channelGithub: 'GitHub',
            channelGithubDesc: 'Open-source projects and tools',
            channelSteam: 'Steam',
            channelSteamDesc: 'Ecliptica on Steam',
            channelDiscord: 'Discord',
            channelDiscordDesc: 'Chat with the team and the community',
            channelTelegram: 'Telegram',
            channelTelegramDesc: 'Ecliptica announcements',
            channelReddit: 'Reddit',
            channelRedditDesc: 'r/Ecliptica community',
            channelBluesky: 'Bluesky',
            channelBlueskyDesc: 'Official company account',
            channelYoutube: 'YouTube',
            channelYoutubeDesc: 'Devlogs and trailers',
            channelEmail: 'Email',
            channelEmailDesc: 'Business and support inquiries'
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
            text: 'Исследуйте наши открытые проекты и инструменты.',
            empty: 'Проектов пока нет.',
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
        projectsDetail: {
            backToCatalog: 'Назад ко всем проектам',
            platformsLabel: 'Поддерживаемые платформы',
            problemTitle: 'Проблема',
            valueTitle: 'Зачем это нужно',
            featuresTitle: 'Возможности',
            stackTitle: 'Технологический стек',
            mediaTitle: 'Медиа и загрузки',
            githubTitle: 'Открытый код на GitHub',
            noGithubTitle: 'Нет публичного репозитория',
            githubStars: 'Звёзды на GitHub',
            githubLatestRelease: 'Последний релиз',
            githubCached: 'Данные GitHub кэшируются при сборке из GitHub API - показываются значения последнего успешного обновления.',
            githubUpdated: 'Обновлено',
            githubArchived: 'Этот репозиторий в архиве и доступен только для чтения.',
            githubNoRelease: 'Нет публичных релизов',
            mediaEmpty: 'Скриншоты и демо-видео появятся здесь, как только проект опубликует медиа.',
            mediaCaptionKeyArt: 'Официальный ключ-арт (капсула Steam)',
            mediaCaptionEnvironment: 'Арт окружения и мира',
            btnSteam: 'Играть в Steam',
            btnWishlist: 'В желаемое',
            btnDownload: 'Скачать',
            btnGithub: 'Открыть на GitHub',
            btnDocs: 'Документация',
            btnContact: 'Связаться с командой',
            btnEclipticaHub: 'Страница Ecliptica',
            categories: {
                games: 'Игры',
                developerTools: 'Инструменты разработчика',
                desktopApps: 'Десктоп и мобильные приложения',
                libraries: 'Библиотеки'
            },
            statuses: {
                activeDevelopment: 'Активная разработка',
                released: 'Выпущен',
                openSource: 'Открытый код',
                beta: 'Бета'
            },
            ecliptica: {
                problem: 'Survival-игры и экономические симуляторы редко встречаются: процедурные миры без живой экономики или стратегии без мира, по которому можно ходить. Ecliptica закрывает этот разрыв на современном кроссплатформенном движке.',
                value: '3D-симулятор выживания и экономики в открытом мире на Qt Quick 3D. Вы командуете последней космической станцией, терраформируете планеты и наблюдаете, как полностью динамичная экономика, управляемая NPC, реагирует на каждое ваше решение.',
                feature1: 'Процедурно генерируемые открытые миры с изменяемым рельефом',
                feature2: 'Полностью динамичная экономика, управляемая NPC',
                feature3: 'Строительство поселений с чертежами и терминальными системами',
                feature4: 'Корпорации и фракции под управлением игрока',
                githubNote: 'Ecliptica — коммерческая игра в Steam. Публичный репозиторий содержит официальный веб-сайт игры, а не код игры.'
            },
            cqtdeployer: {
                problem: 'Выпуск приложения на Qt/QML означает поиск DLL, модулей Qt и плагинов под каждую операционную систему — медленно, вручную и с ошибками.',
                value: 'CQtDeployer автоматизирует кроссплатформенное развёртывание приложений на QML, Qt и других C/C++ фреймворках: один инструмент собирает нужные бинарники, модули и плагины для целевой платформы.',
                feature1: 'Развёртывание в один клик для QML и Qt/C++ приложений',
                feature2: 'Целевые платформы Windows, Linux и macOS из единого процесса',
                feature3: 'Автоматическое определение нужных модулей Qt и плагинов',
                feature4: 'Командная строка для CI/CD конвейеров'
            },
            cheatcard: {
                problem: 'Программы лояльности и дисконтные карты живут на бумаге или в разрозненных приложениях: малому бизнесу сложно вести карточные программы, а клиенты теряют выгоды.',
                value: 'CheatCard — кроссплатформенное приложение лояльности и дисконтных карт: все карты клиента в одном месте, а бизнес ведёт программы скидок и лояльности без собственной разработки.',
                feature1: 'Цифровые карты лояльности и скидок в одном кошельке',
                feature2: 'Кроссплатформенный Qt/QML клиент',
                feature3: 'Управление программами скидок и лояльности',
                feature4: 'Построен на стеке QuasarApp C++/Qt'
            },
            yourtimedelivery: {
                noRepo: 'YourTimeDelivery — коммерческий продукт без публичного репозитория. Свяжитесь с командой, чтобы получить демо, лицензию или кастомное развёртывание.',
                problem: 'Небольшие службы доставки теряют время на звонки, таблицы и бумажные маршруты: диспетчеризация, планирование маршрутов и уведомления клиентов работают в инструментах, которые не общаются между собой.',
                value: 'YourTimeDelivery — система управления доставкой и логистикой: диспетчеризация, планирование маршрутов и статусы доставки в одном кроссплатформенном приложении.',
                feature1: 'Диспетчеризация и планирование маршрутов в едином процессе',
                feature2: 'Отслеживание статусов доставки по всему парку',
                feature3: 'Кроссплатформенные десктопные и мобильные клиенты'
            },
            qtssecret: {
                problem: 'Чтобы добавить шифрование в C++/Qt проект, обычно приходится интегрировать сырую C-библиотеку: контексты, ключи и особенности платформ в своём коде.',
                value: 'Qt-Secret — простая C++ библиотека шифрования с полноценной поддержкой RSA и AES, созданная для прямого использования в Qt-приложениях.',
                feature1: 'Алгоритмы RSA и AES из коробки',
                feature2: 'Простой C++ API для Qt-проектов',
                feature3: 'Интеграция через CMake в существующие сборки'
            },
            heart: {
                problem: 'Каждый C++/Qt проект заново изобретает одни и те же детали: доступ к базе данных, лёгкие сетевые запросы и общие backend-примитивы.',
                value: 'Heart — базовая backend-библиотека для C++/Qt проектов: одна зависимость для работы с базами данных и лёгкими сетевыми запросами, проверенная во всём инструментарии QuasarApp.',
                feature1: 'Слой доступа к базам данных для C++/Qt приложений',
                feature2: 'Утилиты лёгких сетевых запросов',
                feature3: 'Общие backend-примитивы экосистемы QuasarApp'
            }
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
            description: 'Наша миссия — создавать высококачественное программное обеспечение, которое помогает разработчикам и организациям преуспевать.',
            text2: 'Наша команда состоит из увлечённых инженеров, работающих с передовыми технологиями, от десктопных фреймворков до веб-приложений и инструментов для разработки игр.'
        },
        aboutPage: {
            backToHome: 'На главную',
            badgeStudio: 'Студия софта и игр',
            badgeB2b: 'B2B-услуги',
            location: 'Бар, Черногория',
            backgroundTitle: 'О студии',
            background1: 'QuasarApp Group d.o.o. — студия высокотехнологичного программного и игрового обеспечения с базой в городе Бар, Черногория.',
            background2: 'Мы специализируемся на C++/Qt/QML, кроссплатформенных решениях и 3D-движках — от системного программного обеспечения и инструментов разработчика до нашего флагманского 3D-проекта Ecliptica.',
            background3: 'Студия сочетает большой вклад в открытое исходное с B2B-услугами для компаний, которым нужны профессиональные C++/Qt-разработчики.',
            metricsNote: 'Открытое исходное: репозитории и звёзды кэшируются при сборке из GitHub API.',
            competenciesTitle: 'Компетенции команды',
            competenciesSubtitle: 'Инженерные направления, с которыми команда работает каждый день.',
            cpp23Title: 'C++23',
            cpp23Text: 'Современные кодовые базы на C++23: строгие предупреждения, шаблоны и производительный дизайн.',
            qtqmlTitle: 'Qt/QML',
            qtqmlText: 'Разработка приложений Qt 6 и QML — декларативные интерфейсы, 3D на Qt Quick 3D и интеграция с нативными платформами.',
            cicdTitle: 'CI/CD',
            cicdText: 'Автоматизированные конвейеры сборки, тестов и релизов на GitHub Actions для целей Linux, Windows и Android.',
            deploymentTitle: 'Кроссплатформенное развёртывание',
            deploymentText: 'Упаковка, дистрибуция и развёртывание C++/Qt-приложений для настольных и мобильных платформ.',
            servicesTitle: 'B2B-услуги',
            servicesSubtitle: 'Чёткие, структурированные форматы работы для компаний и партнёров.',
            outsourcingTitle: 'Аутсорсинг',
            outsourcingText: 'Выделенные C++/Qt-инженеры: ваша продуктовая команда получает опытных разработчиков, которые выпускают production-софт.',
            consultingTitle: 'Консалтинг',
            consultingText: 'Архитектурные ревью, выбор технологий и аудит кода C++/Qt/QML-продуктов — от прототипов до корпоративных систем.',
            portingTitle: 'Портинг платформ',
            portingText: 'Портирование и адаптация существующих приложений на новые платформы и операционные системы — от настольного Linux до Android и Windows.',
            ctaTitle: 'Сотрудничайте с нами',
            ctaText: 'Есть C++/Qt-проект, порт или продукт? Расскажите нам о нём.',
            ctaButton: 'Связаться с нами'
        },
        stats: {
            projects: 'Проекты',
            stars: 'Звёзды',
            contributors: 'Вкладчики'
        },
        contact: {
            title: 'Связаться с нами',
            text: 'Свяжитесь с нами.',
            email: 'Email',
            github: 'GitHub',
            message: 'Свяжитесь с нами через наши официальные каналы — ссылки доступны в подвале.',
            page: 'Страница контактов'
        },
        contacts: {
            title: 'Контакты',
            lead: 'Свяжитесь с QuasarApp Group — деловые запросы, пресса, партнёрства или поддержка.',
            formHeading: 'Отправьте нам сообщение',
            formText: 'Заполните форму, и мы ответим вам. Сообщения защищены анти-спам проверкой.',
            name: 'Ваше имя',
            namePlaceholder: 'Иван Петров',
            email: 'Email',
            emailPlaceholder: 'ivan@example.com',
            message: 'Сообщение',
            messagePlaceholder: 'Расскажите о вашем проекте или вопросе…',
            send: 'Отправить сообщение',
            sending: 'Отправка…',
            success: 'Спасибо! Ваше сообщение отправлено — мы скоро ответим.',
            fallbackSuccess: 'Ваш почтовый клиент открыт с заранее заполненным сообщением. Нажмите «Отправить» в приложении, чтобы отправить его.',
            error: 'Что-то пошло не так при отправке сообщения. Попробуйте ещё раз или напишите нам напрямую по email.',
            rateLimited: 'Недавно было отправлено слишком много сообщений. Попробуйте позже или напишите нам напрямую по email.',
            fallbackNotice: 'Прямая отправка формы пока не включена. При отправке откроется ваш почтовый клиент с заполненным сообщением — нажмите «Отправить» там, чтобы доставить его.',
            directEmail: 'Предпочитаете email?',
            directEmailText: 'Напишите нам напрямую на quasarappdevelop@gmail.com — мы ответим вам.',
            errName: 'Введите ваше имя (минимум 2 символа).',
            errEmail: 'Введите корректный адрес email.',
            errMessage: 'Введите сообщение (минимум 10 символов).',
            linksHeading: 'Официальные каналы',
            linksText: 'Находите и следите за QuasarApp на официальных площадках.',
            channelGithub: 'GitHub',
            channelGithubDesc: 'Проекты с открытым кодом и инструменты',
            channelSteam: 'Steam',
            channelSteamDesc: 'Ecliptica в Steam',
            channelDiscord: 'Discord',
            channelDiscordDesc: 'Общение с командой и сообществом',
            channelTelegram: 'Telegram',
            channelTelegramDesc: 'Анонсы Ecliptica',
            channelReddit: 'Reddit',
            channelRedditDesc: 'Сообщество r/Ecliptica',
            channelBluesky: 'Bluesky',
            channelBlueskyDesc: 'Официальный аккаунт компании',
            channelYoutube: 'YouTube',
            channelYoutubeDesc: 'Devlog и трейлеры',
            channelEmail: 'Email',
            channelEmailDesc: 'Деловые запросы и поддержка'
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
            text: 'Entdecken Sie unsere Open-Source-Projekte und Tools.',
            empty: 'Keine Projekte verfügbar.',
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
        projectsDetail: {
            backToCatalog: 'Zurück zu allen Projekten',
            platformsLabel: 'Unterstützte Plattformen',
            problemTitle: 'Das Problem',
            valueTitle: 'Warum es existiert',
            featuresTitle: 'Funktionen',
            stackTitle: 'Technologie-Stack',
            mediaTitle: 'Medien & Downloads',
            githubTitle: 'Open Source auf GitHub',
            noGithubTitle: 'Kein öffentliches Repository',
            githubStars: 'Sterne auf GitHub',
            githubLatestRelease: 'Letztes Release',
            githubCached: 'GitHub-Daten werden beim Build aus der GitHub-API gecacht - die angezeigten Werte stammen vom letzten erfolgreichen Abruf.',
            githubUpdated: 'Aktualisiert',
            githubArchived: 'Dieses Repository ist archiviert und nur noch schreibgeschützt.',
            githubNoRelease: 'Keine öffentlichen Releases',
            mediaEmpty: 'Screenshots und Demo-Videos erscheinen hier, sobald das Projekt öffentliche Medien veröffentlicht.',
            mediaCaptionKeyArt: 'Offizielles Key Art (Steam-Kapsel)',
            mediaCaptionEnvironment: 'Umgebungs- und Welten-Art',
            btnSteam: 'Auf Steam spielen',
            btnWishlist: 'Zur Wunschliste',
            btnDownload: 'Download',
            btnGithub: 'Auf GitHub ansehen',
            btnDocs: 'Dokumentation',
            btnContact: 'Team kontaktieren',
            btnEclipticaHub: 'Zum Ecliptica-Hub',
            categories: {
                games: 'Spiele',
                developerTools: 'Entwickler-Tools',
                desktopApps: 'Desktop- & Mobile-Apps',
                libraries: 'Bibliotheken'
            },
            statuses: {
                activeDevelopment: 'Aktive Entwicklung',
                released: 'Veröffentlicht',
                openSource: 'Open Source',
                beta: 'Beta'
            },
            ecliptica: {
                problem: 'Survival- und Wirtschaftssimulationen treffen selten aufeinander: offene Welten ohne lebendige Ökonomie oder Strategie ohne eine Welt, in der man selbst unterwegs ist. Ecliptica schließt diese Lücke auf einer modernen Cross-Plattform-Engine.',
                value: 'Ein 3D-Open-World-Survival- & Wirtschaftssimulator auf Qt Quick 3D. Sie commandieren die letzte Raumstation, terraformen ferne Planeten und beobachten, wie eine vollständig dynamische, von NPC getriebene Ökonomie auf jede Ihrer Entscheidungen reagiert.',
                feature1: 'Prozedural generierte offene Welten mit veränderbarem Gelände',
                feature2: 'Vollständig dynamische, von NPC getriebene Ökonomie',
                feature3: 'Siedlungsbau mit Bauplänen und Terminal-Systemen',
                feature4: 'Vom Spieler geführte Korporationen und Fraktionen',
                githubNote: 'Ecliptica ist ein kommerzielles Steam-Spiel. Das öffentliche Repository hostet die offizielle Website des Spiels, nicht den Spielcode.'
            },
            cqtdeployer: {
                problem: 'Das Ausliefern einer Qt/QML-Anwendung bedeutet: auf jedem Betriebssystem die passenden DLLs, Qt-Module und Plugins zusammenzusuchen - langsam, manuell und fehleranfällig.',
                value: 'CQtDeployer automatisiert das Cross-Platform-Deployment von QML-, Qt- und anderen C/C++-Anwendungen: Ein Tool sammelt die richtigen Binaries, Module und Plugins für Ihre Zielplattform.',
                feature1: 'Deployment per Klick für QML- und Qt/C++-Anwendungen',
                feature2: 'Windows, Linux und macOS aus einem einzigen Workflow',
                feature3: 'Automatische Erkennung benötigter Qt-Module und Plugins',
                feature4: 'Befehlszeilenschnittstelle für CI/CD-Pipelines'
            },
            cheatcard: {
                problem: 'Loyalitäts- und Rabattprogramme leben auf Papier oder in isolierten Apps - kleine Unternehmen haben es schwer, Kartenprogramme zu betreiben, und Kunden verlieren ihre Vorteile aus den Augen.',
                value: 'CheatCard ist eine plattformübergreifende Loyalitäts- und Rabattkarten-Anwendung: Kunden führen alle Karten an einem Ort, und Unternehmen betreiben Rabatt- und Loyalitätsprogramme ohne eigene Software.',
                feature1: 'Digitale Loyalitäts- und Rabattkarten in einer Wallet',
                feature2: 'Plattformübergreifender Qt/QML-Client',
                feature3: 'Verwaltung von Rabatt- und Loyalitätsprogrammen',
                feature4: 'Auf dem QuasarApp C++/Qt-Stack gebaut'
            },
            yourtimedelivery: {
                noRepo: 'YourTimeDelivery ist ein kommerzielles Produkt ohne öffentliches Repository. Kontaktieren Sie das Team für eine Demo, Lizenzierung oder eine Custom-Installation.',
                problem: 'Kleine Lieferdienste verlieren Zeit für Anrufe, Tabellen und papierbasierte Routen: Dispatch, Routenplanung und Kundenupdates laufen in Tools, die untereinander nicht kommunizieren.',
                value: 'YourTimeDelivery ist ein System für Liefer- und Logistikmanagement, das Dispatch, Routenplanung und Lieferstatus in einer plattformübergreifenden Anwendung bündelt.',
                feature1: 'Dispatch und Routenplanung in einem Workflow',
                feature2: 'Lieferstatus-Tracking über die gesamte Flotte',
                feature3: 'Plattformübergreifende Desktop- und Mobile-Clients'
            },
            qtssecret: {
                problem: 'Kryptographie in ein C++/Qt-Projekt einzubauen bedeutet meist, eine rohe C-Bibliothek zu integrieren: manuelle Kontexte, Schlüsselverwaltung und Plattform-Spezialitäten im eigenen Code.',
                value: 'Qt-Secret ist eine einfache C++-Verschlüsselungsbibliothek mit erstklassiger RSA- und AES-Unterstützung, entwickelt zum direkten Einsatz in Qt-Anwendungen.',
                feature1: 'RSA- und AES-Algorithmen direkt aus der Box',
                feature2: 'Einfache C++-API für Qt-Projekte',
                feature3: 'CMake-basierte Integration in bestehende Builds'
            },
            heart: {
                problem: 'Jedes C++/Qt-Projekt erfindet dieselbe Kleinarbeit neu: Datenbankzugriff, leichte Netzwerkrequests und gemeinsame Backend-Primitiven.',
                value: 'Heart ist die Basis-Backend-Bibliothek für C++/Qt-Projekte - eine Abhängigkeit für Datenbankarbeit und leichte Netzwerkrequests, erprobt im gesamten QuasarApp-Toolset.',
                feature1: 'Datenbankzugriffsschicht für C++/Qt-Anwendungen',
                feature2: 'Leichte Netzwerk-Request-Utilities',
                feature3: 'Gemeinsame Backend-Primitiven des QuasarApp-Ökosystems'
            }
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
            description: 'Unsere Mission ist es, hochwertiges Software zu entwickeln, das Entwicklern und Organisationen hilft, erfolgreich zu sein.',
            text2: 'Unsere Mannschaft besteht aus leidenschaftlichen Ingenieuren, die mit state-of-the-art-Technologien arbeiten, von Desktop-Frameworks bis hin zu Webanwendungen und Spieleentwicklungswerkzeugen.'
        },
        aboutPage: {
            backToHome: 'Zur Startseite',
            badgeStudio: 'Software- & Spielestudio',
            badgeB2b: 'B2B-Leistungen',
            location: 'Bar, Montenegro',
            backgroundTitle: 'Das Studio',
            background1: 'QuasarApp Group d.o.o. ist ein High-Tech-Studio für Software- und Spieleentwicklung mit Sitz in Bar, Montenegro.',
            background2: 'Wir spezialisieren uns auf C++/Qt/QML, plattformübergreifende Lösungen und 3D-Engines - von Systemsoftware und Entwicklerwerkzeugen bis zu unserem Flaggschiff-3D-Spiel Ecliptica.',
            background3: 'Das Studio verbindet einen großen Open-Source-Fußabdruck mit B2B-Leistungen für Unternehmen, die produktionsreife C++/Qt-Expertise benötigen.',
            metricsNote: 'Open-Source-Fußabdruck: Repositories und Sterne werden beim Build aus der GitHub-API gecacht.',
            competenciesTitle: 'Team-Kompetenzen',
            competenciesSubtitle: 'Die Engineeringsdisziplinen, mit denen das Team täglich arbeitet.',
            cpp23Title: 'C++23',
            cpp23Text: 'Moderne C++23-Codebasen mit strengen Warnrichtlinien, Templates und performanzkritischem Design.',
            qtqmlTitle: 'Qt/QML',
            qtqmlText: 'Qt 6 und QML Anwendungsentwicklung - deklarative UIs, 3D mit Qt Quick 3D und native Plattformintegration.',
            cicdTitle: 'CI/CD',
            cicdText: 'Automatisierte Build-, Test- und Release-Pipelines auf GitHub Actions für Linux, Windows und Android.',
            deploymentTitle: 'Plattformübergreifende Distribution',
            deploymentText: 'Packaging, Verteilung und Deployment von C++/Qt-Anwendungen für Desktop- und Mobile-Plattformen.',
            servicesTitle: 'B2B-Leistungen',
            servicesSubtitle: 'Klare, strukturierte Engagements für Unternehmen und Partner.',
            outsourcingTitle: 'Outsourcing',
            outsourcingText: 'Dedizierte C++/Qt-Engineering-Kapazität: Ihr Team erhält erfahrene Entwickler, die Produktionssoftware liefern.',
            consultingTitle: 'Beratung',
            consultingText: 'Architektur-Reviews, Technologieauswahl und Code-Audits für C++/Qt/QML-Produkte - von Prototypen bis Enterprise-Systeme.',
            portingTitle: 'Plattformportierung',
            portingText: 'Portierung und Anpassung bestehender Anwendungen auf neue Plattformen und Betriebssysteme, von Linux Desktop bis Android und Windows.',
            ctaTitle: 'Arbeiten Sie mit uns',
            ctaText: 'Sie haben ein C++/Qt-Projekt, eine Portierung oder ein Produkt im Sinn? Sprechen Sie mit uns.',
            ctaButton: 'Kontaktieren Sie uns'
        },
        stats: {
            projects: 'Projekte',
            stars: 'Sterne',
            contributors: 'Beiträger'
        },
        contact: {
            title: 'Kontaktieren Sie uns',
            text: 'Kontaktieren Sie uns.',
            email: 'E-Mail',
            github: 'GitHub',
            message: 'Kontaktieren Sie uns über unsere offiziellen Kanäle - Links sind im Footer verfügbar.',
            page: 'Kontaktseite'
        },
        contacts: {
            title: 'Kontakt',
            lead: 'Setzen Sie sich mit der QuasarApp Group in Verbindung — Geschäftsanfragen, Presse, Partnerschaften oder Support.',
            formHeading: 'Senden Sie uns eine Nachricht',
            formText: 'Füllen Sie das Formular aus, und wir melden uns bei Ihnen. Nachrichten werden durch Anti-Spam-Prüfungen geschützt.',
            name: 'Ihr Name',
            namePlaceholder: 'Max Mustermann',
            email: 'E-Mail',
            emailPlaceholder: 'max@example.com',
            message: 'Nachricht',
            messagePlaceholder: 'Erzählen Sie uns von Ihrem Projekt oder Ihrer Frage…',
            send: 'Nachricht senden',
            sending: 'Wird gesendet…',
            success: 'Danke! Ihre Nachricht wurde gesendet — wir melden uns bald bei Ihnen.',
            fallbackSuccess: 'Ihr E-Mail-Programm wurde mit Ihrer vorbereiteten Nachricht geöffnet. Drücken Sie dort auf „Senden“, um sie zu übermitteln.',
            error: 'Beim Senden Ihrer Nachricht ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.',
            rateLimited: 'In letzter Zeit wurden zu viele Nachrichten gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie uns per E-Mail.',
            fallbackNotice: 'Die direkte Übermittlung über das Formular ist noch nicht aktiviert. Beim Absenden öffnet sich Ihr E-Mail-Programm mit Ihrer vorbereiteten Nachricht — drücken Sie dort auf „Senden“, um sie zu übermitteln.',
            directEmail: 'E-Mail bevorzugt?',
            directEmailText: 'Schreiben Sie uns direkt an quasarappdevelop@gmail.com — wir melden uns bei Ihnen.',
            errName: 'Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).',
            errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            errMessage: 'Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.',
            linksHeading: 'Offizielle Kanäle',
            linksText: 'Erreichen und folgen Sie QuasarApp auf seinen offiziellen Plattformen.',
            channelGithub: 'GitHub',
            channelGithubDesc: 'Open-Source-Projekte und Tools',
            channelSteam: 'Steam',
            channelSteamDesc: 'Ecliptica auf Steam',
            channelDiscord: 'Discord',
            channelDiscordDesc: 'Chat mit Team und Community',
            channelTelegram: 'Telegram',
            channelTelegramDesc: 'Ecliptica-Ankündigungen',
            channelReddit: 'Reddit',
            channelRedditDesc: 'Community r/Ecliptica',
            channelBluesky: 'Bluesky',
            channelBlueskyDesc: 'Offizielles Unternehmenskonto',
            channelYoutube: 'YouTube',
            channelYoutubeDesc: 'Devlogs und Trailer',
            channelEmail: 'E-Mail',
            channelEmailDesc: 'Geschäfts- und Supportanfragen'
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
            text: 'Explora nuestros proyectos de código abierto y herramientas.',
            empty: 'No hay proyectos disponibles.',
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
        projectsDetail: {
            backToCatalog: 'Volver a todos los proyectos',
            platformsLabel: 'Plataformas compatibles',
            problemTitle: 'El problema',
            valueTitle: 'Por qué existe',
            featuresTitle: 'Características',
            stackTitle: 'Stack tecnológico',
            mediaTitle: 'Medios y descargas',
            githubTitle: 'Código abierto en GitHub',
            noGithubTitle: 'Sin repositorio público',
            githubStars: 'Estrellas en GitHub',
            githubLatestRelease: 'Última versión',
            githubCached: 'Los datos de GitHub se cachéan en tiempo de compilación desde la API de GitHub - los valores mostrados son del último fetch correcto.',
            githubUpdated: 'Actualizado',
            githubArchived: 'Este repositorio está archivado y ahora es de solo lectura.',
            githubNoRelease: 'Sin versiones públicas',
            mediaEmpty: 'Las capturas y vídeos de demo aparecerán aquí en cuanto el proyecto publique medios.',
            mediaCaptionKeyArt: 'Arte clave oficial (cápsula de Steam)',
            mediaCaptionEnvironment: 'Arte de entornos y mundo',
            btnSteam: 'Jugar en Steam',
            btnWishlist: 'Añadir a deseos',
            btnDownload: 'Descargar',
            btnGithub: 'Ver en GitHub',
            btnDocs: 'Documentación',
            btnContact: 'Contactar al equipo',
            btnEclipticaHub: 'Visitar el hub de Ecliptica',
            categories: {
                games: 'Juegos',
                developerTools: 'Herramientas de desarrollo',
                desktopApps: 'Apps de escritorio y móvil',
                libraries: 'Bibliotecas'
            },
            statuses: {
                activeDevelopment: 'Desarrollo activo',
                released: 'Publicado',
                openSource: 'Código abierto',
                beta: 'Beta'
            },
            ecliptica: {
                problem: 'Los juegos de supervivencia y las simulaciones económicas rara vez se encuentran: mundos abiertos sin economía viva o estrategia sin un mundo en el que caminar. Ecliptica cierra ese hueco sobre un motor cross-platform moderno.',
                value: 'Un simulador 3D de supervivencia y economía en mundo abierto construido sobre Qt Quick 3D. Comandas la última estación espacial, terraformas planetas distantes y observas cómo una economía totalmente dinámica impulsada por NPC reacciona a cada decisión que tomas.',
                feature1: 'Mundos abiertos procedurales con terreno deformable',
                feature2: 'Economía totalmente dinámica impulsada por NPC',
                feature3: 'Construcción de asentamientos con planos y sistemas de terminal',
                feature4: 'Corporaciones y facciones gestionadas por el jugador',
                githubNote: 'Ecliptica es un juego comercial de Steam. El repositorio público aloja la página web oficial del juego, no el código del juego.'
            },
            cqtdeployer: {
                problem: 'Publicar una aplicación Qt/QML implica perseguir DLLs, módulos de Qt y plugins específicos de cada sistema operativo: lento, manual y propenso a errores.',
                value: 'CQtDeployer automatiza el despliegue multiplataforma de aplicaciones QML, Qt y otros C/C++: una herramienta que recoge los binarios, módulos y plugins correctos para tu plataforma objetivo.',
                feature1: 'Despliegue con un clic para aplicaciones QML y Qt/C++',
                feature2: 'Windows, Linux y macOS desde un mismo flujo',
                feature3: 'Detección automática de módulos de Qt y plugins requeridos',
                feature4: 'Interfaz de línea de comandos para pipelines CI/CD'
            },
            cheatcard: {
                problem: 'Los programas de lealtad y las tarjetas de descuento viven en papel o en apps aisladas, así que las pequeñas empresas luchan por gestionar programas de tarjetas y los clientes pierden la pista de sus beneficios.',
                value: 'CheatCard es una aplicación multiplataforma de lealtad y tarjetas de descuento: los clientes llevan todas sus tarjetas en un solo lugar y las empresas gestionan programas de descuentos y lealtad sin software propio.',
                feature1: 'Tarjetas de lealtad y descuento digitales en una sola cartera',
                feature2: 'Cliente QML multiplataforma',
                feature3: 'Gestión de programas de descuentos y lealtad',
                feature4: 'Construido sobre el stack C++/Qt de QuasarApp'
            },
            yourtimedelivery: {
                noRepo: 'YourTimeDelivery es un producto comercial y no tiene repositorio público. Contacta al equipo para una demo, licencia o un despliegue a medida.',
                problem: 'Las pequeñas operaciones de entrega pierden tiempo en llamadas, hojas de cálculo y rutas en papel: el despacho, la planificación de rutas y las actualizaciones al cliente corren en herramientas que no se hablan entre sí.',
                value: 'YourTimeDelivery es un sistema de gestión de entregas y logística que mantiene despacho, planificación de rutas y estado de entrega en una aplicación multiplataforma.',
                feature1: 'Despacho y planificación de rutas en un solo flujo',
                feature2: 'Seguimiento del estado de entrega de toda la flota',
                feature3: 'Clientes de escritorio y móvil multiplataforma'
            },
            qtssecret: {
                problem: 'Añadir criptografía a un proyecto C++/Qt suele significar integrar una biblioteca C cruda: contextos manuales, gestión de claves y peculiaridades de plataforma en tu propio código.',
                value: 'Qt-Secret es una biblioteca de encriptación C++ simple con soporte de primer nivel para RSA y AES, diseñada para usarse directamente en aplicaciones Qt.',
                feature1: 'Algoritmos RSA y AES listos para usar',
                feature2: 'API C++ simple pensada para proyectos Qt',
                feature3: 'Integración vía CMake en builds existentes'
            },
            heart: {
                problem: 'Cada proyecto C++/Qt reinventa la misma plomería: acceso a bases de datos, peticiones ligeras de red y primitivas de backend compartidas.',
                value: 'Heart es la biblioteca de backend base para proyectos C++/Qt: una dependencia para trabajo con bases de datos y peticiones ligeras de red, probada en todo el toolset de QuasarApp.',
                feature1: 'Capa de acceso a bases de datos para aplicaciones C++/Qt',
                feature2: 'Utilidades de peticiones ligeras de red',
                feature3: 'Primitivas de backend compartidas del ecosistema QuasarApp'
            }
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
            description: 'Nuestra misión es desarrollar software de alta calidad que ayude a desarrolladores y organizaciones a tener éxito.',
            text2: 'Nuestro equipo consiste en ingenieros apasionados que trabajan con tecnologías de vanguardia, desde marcos de escritorio hasta aplicaciones web y herramientas de desarrollo de juegos.'
        },
        aboutPage: {
            backToHome: 'Volver al inicio',
            badgeStudio: 'Estudio de software y videojuegos',
            badgeB2b: 'Servicios B2B',
            location: 'Bar, Montenegro',
            backgroundTitle: 'El estudio',
            background1: 'QuasarApp Group d.o.o. es un estudio de alto rendimiento para el desarrollo de software y videojuegos con sede en Bar, Montenegro.',
            background2: 'Especializados en C++/Qt/QML, soluciones multiplataforma y motores 3D: desde software de sistema y herramientas de desarrollo hasta nuestro título 3D insignia, Ecliptica.',
            background3: 'El estudio combina una amplia huella open source con servicios B2B para empresas que necesitan experiencia C++/Qt de nivel producción.',
            metricsNote: 'Huella open source: los repositorios y estrellas se cachean en tiempo de compilación desde la API de GitHub.',
            competenciesTitle: 'Competencias del equipo',
            competenciesSubtitle: 'Las disciplinas de ingeniería con las que el equipo trabaja a diario.',
            cpp23Title: 'C++23',
            cpp23Text: 'Códigos modernos en C++23 con políticas de avisos estrictas, plantillas y diseño orientado al rendimiento.',
            qtqmlTitle: 'Qt/QML',
            qtqmlText: 'Desarrollo de aplicaciones Qt 6 y QML: interfaces declarativas, 3D con Qt Quick 3D e integración nativa con las plataformas.',
            cicdTitle: 'CI/CD',
            cicdText: 'Pipelines automatizados de compilación, pruebas y releases en GitHub Actions para Linux, Windows y Android.',
            deploymentTitle: 'Despliegue multiplataforma',
            deploymentText: 'Empaquetado, distribución y despliegue de aplicaciones C++/Qt para plataformas de escritorio y móviles.',
            servicesTitle: 'Servicios B2B',
            servicesSubtitle: 'Colaboraciones claras y estructuradas para empresas y partners.',
            outsourcingTitle: 'Externalización',
            outsourcingText: 'Capacidad de ingeniería C++/Qt dedicada: su equipo de producto recibe desarrolladores seniors que entregan software de producción.',
            consultingTitle: 'Consultoría',
            consultingText: 'Revisiones de arquitectura, selección de tecnologías y auditorías de código para productos C++/Qt/QML: desde prototipos hasta sistemas empresariales.',
            portingTitle: 'Portabilidad entre plataformas',
            portingText: 'Porte y adapta aplicaciones existentes a nuevas plataformas y sistemas operativos, desde Linux de escritorio hasta Android y Windows.',
            ctaTitle: 'Trabaja con nosotros',
            ctaText: '¿Tienes un proyecto C++/Qt, un port o un producto en mente? Cuéntanos.',
            ctaButton: 'Ponte en contacto'
        },
        stats: {
            projects: 'Proyectos',
            stars: 'Estrellas',
            contributors: 'Colaboradores'
        },
        contact: {
            title: 'Contáctanos',
            text: 'Contáctanos.',
            email: 'Email',
            github: 'GitHub',
            message: 'Contáctanos a través de nuestros canales oficiales - los enlaces están disponibles en el pie de página.',
            page: 'Página de contacto'
        },
        contacts: {
            title: 'Contacto',
            lead: 'Ponte en contacto con QuasarApp Group — consultas de negocio, prensa, alianzas o soporte.',
            formHeading: 'Envíanos un mensaje',
            formText: 'Completa el formulario y te responderemos. Los mensajes están protegidos con validación antispam.',
            name: 'Tu nombre',
            namePlaceholder: 'Ana García',
            email: 'Email',
            emailPlaceholder: 'ana@example.com',
            message: 'Mensaje',
            messagePlaceholder: 'Cuéntanos sobre tu proyecto o pregunta…',
            send: 'Enviar mensaje',
            sending: 'Enviando…',
            success: '¡Gracias! Tu mensaje ha sido enviado — te responderemos pronto.',
            fallbackSuccess: 'Se abrió tu cliente de correo con el mensaje prellenado. Pulsa Enviar en la app de correo para enviarlo.',
            error: 'Algo salió mal al enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente por correo.',
            rateLimited: 'Se enviaron demasiados mensajes recientemente. Inténtalo más tarde o escríbenos directamente por correo.',
            fallbackNotice: 'El envío directo del formulario aún no está habilitado. Al enviar se abrirá tu cliente de correo con el mensaje prellenado — pulsa Enviar allí para entregarlo.',
            directEmail: '¿Prefieres correo?',
            directEmailText: 'Escríbenos directamente a quasarappdevelop@gmail.com y te responderemos.',
            errName: 'Introduce tu nombre (al menos 2 caracteres).',
            errEmail: 'Introduce una dirección de correo válida.',
            errMessage: 'Introduce un mensaje de al menos 10 caracteres.',
            linksHeading: 'Canales oficiales',
            linksText: 'Encuentra y sigue a QuasarApp en sus plataformas oficiales.',
            channelGithub: 'GitHub',
            channelGithubDesc: 'Proyectos open-source y herramientas',
            channelSteam: 'Steam',
            channelSteamDesc: 'Ecliptica en Steam',
            channelDiscord: 'Discord',
            channelDiscordDesc: 'Charla con el equipo y la comunidad',
            channelTelegram: 'Telegram',
            channelTelegramDesc: 'Anuncios de Ecliptica',
            channelReddit: 'Reddit',
            channelRedditDesc: 'Comunidad r/Ecliptica',
            channelBluesky: 'Bluesky',
            channelBlueskyDesc: 'Cuenta oficial de la empresa',
            channelYoutube: 'YouTube',
            channelYoutubeDesc: 'Devlogs y tráileres',
            channelEmail: 'Email',
            channelEmailDesc: 'Consultas de negocio y soporte'
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
            text: 'Istražite naše open-source projekte i alate.',
            empty: 'Projekti nisu dostupni.',
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
        projectsDetail: {
            backToCatalog: 'Nazad na sve projekte',
            platformsLabel: 'Podržane platforme',
            problemTitle: 'Problem',
            valueTitle: 'Zašto postoji',
            featuresTitle: 'Mogućnosti',
            stackTitle: 'Tehnološki stack',
            mediaTitle: 'Mediji i preuzimanja',
            githubTitle: 'Otvoreni kod na GitHub-u',
            noGithubTitle: 'Nema javnog repozitorijuma',
            githubStars: 'Zvijezde na GitHub-u',
            githubLatestRelease: 'Najnovije izdanje',
            githubCached: 'GitHub podaci se keširaju pri gradnji iz GitHub API - prikazane vrijednosti su od posljednjeg uspješnog osvježavanja.',
            githubUpdated: 'Ažurirano',
            githubArchived: 'Ovaj repozitorijum je arhiviran i dostupan je samo za čitanje.',
            githubNoRelease: 'Nema javnih izdanja',
            mediaEmpty: 'Skrinšoti i demo video pojaviće se ovdje čim projekt objavi javne medije.',
            mediaCaptionKeyArt: 'Zvanični key art (Steam kapsula)',
            mediaCaptionEnvironment: 'Art okruženja i svijeta',
            btnSteam: 'Igraj na Steam-u',
            btnWishlist: 'Dodaj u želje',
            btnDownload: 'Preuzmi',
            btnGithub: 'Pogledaj na GitHub-u',
            btnDocs: 'Dokumentacija',
            btnContact: 'Kontaktiraj tim',
            btnEclipticaHub: 'Posjeti Ecliptica hub',
            categories: {
                games: 'Igre',
                developerTools: 'Alati za developere',
                desktopApps: 'Desktop i mobilne aplikacije',
                libraries: 'Biblioteke'
            },
            statuses: {
                activeDevelopment: 'Aktivni razvoj',
                released: 'Objavljen',
                openSource: 'Otvoreni kod',
                beta: 'Beta'
            },
            ecliptica: {
                problem: 'Survival igre i ekonomske simulacije rijetko se sreću: otvoreni svijetovi bez žive ekonomije ili strategija bez svijeta u kojem možete hodati. Ecliptica zatvara tu jaz na modernom krosplatformnom engine-u.',
                value: '3D survival i ekonomska simulacija u otvorenom svijetu na Qt Quick 3D. Komandujete posljednjom svemirskom stanicom, terraformirate udaljene planete i gledate kako potpuno dinamična ekonomija vođena NPC reaguje na svaku vašu odluku.',
                feature1: 'Proceduralno generisani otvoreni svijetovi sa deformabilnim terenom',
                feature2: 'Potpuno dinamična ekonomija vođena NPC',
                feature3: 'Gradnja naselja sa blueprintovima i terminalnim sistemima',
                feature4: 'Korporacije i frakcije pod upravljanjem igrača',
                githubNote: 'Ecliptica je komercijalna Steam igra. Javni repozitorijum sadrži zvaničnu web stranicu igre, a ne kod igre.'
            },
            cqtdeployer: {
                problem: 'Objavljanje Qt/QML aplikacije znači tražiti platformski specifične DLL-ove, Qt module i pluginove na svakom operativnom sistemu - sporo, ručno i podložno greškama.',
                value: 'CQtDeployer automativizuje krosplatformno postavljanje QML, Qt i drugih C/C++ aplikacija: jedan alat skuplja prave binarne fajlove, module i pluginove za ciljanu platformu.',
                feature1: 'Postavljanje jednim klikom za QML i Qt/C++ aplikacije',
                feature2: 'Windows, Linux i macOS iz jednog workflow-a',
                feature3: 'Automatska detekcija potrebnih Qt modula i pluginova',
                feature4: 'Komandna linija za CI/CD pipeline-ove'
            },
            cheatcard: {
                problem: 'Programi vjernosti i popustne kartice žive na papiru ili u odvojenim aplikacijama, pa malom biznisu teško da vodi kartične programe, a korisnici gube vidljivost svojih pogodnosti.',
                value: 'CheatCard je krosplatformna aplikacija za kartice vjernosti i popuste: korisnici nose sve kartice na jednom mjestu, a biznis vodi programe popusta i vjernosti bez vlastitog softvera.',
                feature1: 'Digitalne kartice vjernosti i popusta u jednom novčaniku',
                feature2: 'Krosplatformni Qt/QML klijent',
                feature3: 'Upravljanje programima popusta i vjernosti',
                feature4: 'Građena na QuasarApp C++/Qt stack-u'
            },
            yourtimedelivery: {
                noRepo: 'YourTimeDelivery je komercijalni proizvod i nema javni repozitorijum. Kontaktirajte tim za demo, licencu ili custom postavljanje.',
                problem: 'Male dostavne operacije gube vrijeme u pozivima, tabelama i papirnim rutama: dispatch, planiranje ruta i ažuriranja klijenata rade u alatima koji ne komuniciraju jedan sa drugim.',
                value: 'YourTimeDelivery je sistem za upravljanje dostavom i logistikom koji drži dispatch, planiranje ruta i status dostave u jednoj krosplatformnoj aplikaciji.',
                feature1: 'Dispatch i planiranje ruta u jednom workflow-u',
                feature2: 'Praćenje statusa dostave preko cijele flote',
                feature3: 'Krosplatformni desktop i mobilni klijenti'
            },
            qtssecret: {
                problem: 'Dodavanje kriptografije u C++/Qt projekat obično znači integraciju sirove C biblioteke: ručni konteksti, rukovanje ključevima i platformski specifičnosti u vašem kodu.',
                value: 'Qt-Secret je jednostavna C++ kriptografska biblioteka sa prvoklasnom podrškom za RSA i AES, osmišljena za direktnu upotrebu u Qt aplikacijama.',
                feature1: 'RSA i AES algoritmi odmah iz kutije',
                feature2: 'Jednostavan C++ API za Qt projekte',
                feature3: 'CMake integracija u postojeće buildove'
            },
            heart: {
                problem: 'Svaki C++/Qt projekat iznova izmišlja iste stvari: pristup bazama podataka, lagani mrežni zahtjevi i zajednički backend primitivi.',
                value: 'Heart je osnovna backend biblioteka za C++/Qt projekte - jedna zavisnost za rad sa bazama podataka i laganim mrežnim zahtjevima, provjerena kroz cijeli QuasarApp alat.',
                feature1: 'Sloj pristupa bazama podataka za C++/Qt aplikacije',
                feature2: 'Alati za lagane mrežne zahtjeve',
                feature3: 'Zajednički backend primitivi QuasarApp ekosistema'
            }
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
            description: 'Naša misija je kreiranje visokokvalitetnog softvera koji pomaže developerima i organizacijama da uspijevaju.',
            text2: 'Naš tim čine strastveni inženjeri koji rade na najnovijim tehnologijama, od desktop frameworkova do web aplikacija i alata za razvoj igara.'
        },
        aboutPage: {
            backToHome: 'Nazad na početnu',
            badgeStudio: 'Studija softvera i igara',
            badgeB2b: 'B2B usluge',
            location: 'Бар, Црна Гора',
            backgroundTitle: 'O studiju',
            background1: 'QuasarApp Group d.o.o. je visokotehnološka studija za razvoj softvera i igara sa bazom u Baru, Crna Gora.',
            background2: 'Specijalizovani smo za C++/Qt/QML inženjering, cross-platform rješenja i 3D engine - od sistemskog softvera i alata za developere do naše flagship 3D igre Ecliptica.',
            background3: 'Studija spaja veliki trag otvorenog koda sa B2B uslugama za kompanije kojima je potreban profesionalni C++/Qt kapacitet.',
            metricsNote: 'Trag otvorenog koda: repozitorijumi i zvijezde se keširaju pri gradnji iz GitHub API.',
            competenciesTitle: 'Kompetencije tima',
            competenciesSubtitle: 'Inženjerske discipline sa kojima tim radi svakodnevno.',
            cpp23Title: 'C++23',
            cpp23Text: 'Moderne C++23 kodove sa strogo politikom upozorenja, templateovima i dizajnom usmjerenim na performanse.',
            qtqmlTitle: 'Qt/QML',
            qtqmlText: 'Razvoj Qt 6 i QML aplikacija - deklarativni interfejsi, 3D preko Qt Quick 3D i integracija sa nativnim platformama.',
            cicdTitle: 'CI/CD',
            cicdText: 'Automatizovani pipelineovi za build, test i release na GitHub Actions za Linux, Windows i Android.',
            deploymentTitle: 'Cross-platform deployment',
            deploymentText: 'Pakovanje, distribucija i deployment C++/Qt aplikacija za desktop i mobilne platforme.',
            servicesTitle: 'B2B usluge',
            servicesSubtitle: 'Jasni, strukturirani angažmani za kompanije i partnere.',
            outsourcingTitle: 'Outsourcing',
            outsourcingText: 'Dedikovan C++/Qt inženjerski kapacitet: vaš tim dobija iskusne developere koji isporučuju production softver.',
            consultingTitle: 'Konsalting',
            consultingText: 'Arhitektonski pregledi, izbor tehnologije i kod audit za C++/Qt/QML produkte - od prototipova do enterprise sistema.',
            portingTitle: 'Prijenos na platforme',
            portingText: 'Porting i adaptacija postojećih aplikacija na nove platforme i operativne sisteme, od Linux desktopa do Androida i Windowsa.',
            ctaTitle: 'Sarađujte sa nama',
            ctaText: 'Imate C++/Qt projekat, port ili produkt na umu? Recite nam o njemu.',
            ctaButton: 'Kontaktirajte nas'
        },
        stats: {
            projects: 'Projekti',
            stars: 'Zvijezde',
            contributors: 'Doprinosioci'
        },
        contact: {
            title: 'Kontaktirajte nas',
            text: 'Kontaktirajte nas.',
            email: 'E-mail',
            github: 'GitHub',
            message: 'Kontaktirajte nas putem naših zvaničnih kanala — linkovi su dostupni u podnožju.',
            page: 'Strana za kontakt'
        },
        contacts: {
            title: 'Kontakt',
            lead: 'Kontaktirajte QuasarApp Group — poslovna pitanja, prasa, partnerstva ili podrška.',
            formHeading: 'Pošaljite nam poruku',
            formText: 'Ispunite formular i javićemo vam se. Poruke su zaštićene anti-spam provjerom.',
            name: 'Vaše ime',
            namePlaceholder: 'Petar Petrović',
            email: 'Email',
            emailPlaceholder: 'petar@example.com',
            message: 'Poruka',
            messagePlaceholder: 'Recite nam o vašem projektu ili pitanju…',
            send: 'Pošalji poruku',
            sending: 'Šalje se…',
            success: 'Hvala! Vaša poruka je poslana — javićemo vam se uskoro.',
            fallbackSuccess: 'Otvoren je vaš email klijent sa unaprijed popunjenom porukom. Pritisnite Pošalji u aplikaciji da je dostavite.',
            error: 'Došlo je do greške pri slanju poruke. Pokušajte ponovo ili nam pišite direktno emailom.',
            rateLimited: 'Premno poruka je poslano nedavno. Pokušajte kasnije ili nam pišite direktno emailom.',
            fallbackNotice: 'Direktno slanje formulara još nije omogućeno. Slanjem se otvara vaš email klijent sa unaprijed popunjenom porukom — tamo pritisnite Pošalji da je dostavite.',
            directEmail: 'Preferirate email?',
            directEmailText: 'Pišite nam direktno na quasarappdevelop@gmail.com — javićemo vam se.',
            errName: 'Unesite vaše ime (najmanje 2 znaka).',
            errEmail: 'Unesite ispravnu email adresu.',
            errMessage: 'Unesite poruku od najmanje 10 znakova.',
            linksHeading: 'Zvanični kanali',
            linksText: 'Pronađite i pratite QuasarApp na zvaničnim platformama.',
            channelGithub: 'GitHub',
            channelGithubDesc: 'Open-source projekti i alati',
            channelSteam: 'Steam',
            channelSteamDesc: 'Ecliptica na Steamu',
            channelDiscord: 'Discord',
            channelDiscordDesc: 'Razgovor sa timom i zajednicom',
            channelTelegram: 'Telegram',
            channelTelegramDesc: 'Anonsi Ecliptica',
            channelReddit: 'Reddit',
            channelRedditDesc: 'Zajednica r/Ecliptica',
            channelBluesky: 'Bluesky',
            channelBlueskyDesc: 'Zvanični nalog kompanije',
            channelYoutube: 'YouTube',
            channelYoutubeDesc: 'Devlog i traileri',
            channelEmail: 'Email',
            channelEmailDesc: 'Poslovna pitanja i podrška'
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
