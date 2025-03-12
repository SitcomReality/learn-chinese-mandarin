import { Howl } from 'howler';

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const categoryBtn = document.getElementById('category-btn');
    const quizBtn = document.getElementById('quiz-btn');
    const categoriesSection = document.getElementById('categories-section');
    const phrasesSection = document.getElementById('phrases-section');
    const quizSection = document.getElementById('quiz-section');
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    const categoryGrid = document.querySelector('.category-grid');
    const phraseList = document.querySelector('.phrase-list');
    const currentCategoryTitle = document.getElementById('current-category');
    const quizOptions = document.querySelector('.quiz-options');
    const quizQuestion = document.querySelector('.chinese-phrase');
    const quizFeedback = document.querySelector('.quiz-feedback');
    const feedbackMessage = document.querySelector('.feedback-message');
    const nextQuestionBtn = document.querySelector('.next-question');
    const progressFill = document.querySelector('.progress-fill');
    const scoreDisplay = document.getElementById('score');

    // State
    let currentCategory = null;
    let quizPhrases = [];
    let currentQuizQuestion = null;
    let score = 0;
    let questionNumber = 0;
    const questionsPerQuiz = 10;

    // Data
    const categories = [
        { id: 'greetings', name: 'Greetings', icon: '👋' },
        { id: 'numbers', name: 'Numbers', icon: '🔢' },
        { id: 'food', name: 'Food & Drinks', icon: '🍜' },
        { id: 'travel', name: 'Travel', icon: '✈️' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️' },
        { id: 'directions', name: 'Directions', icon: '🧭' }
    ];

    const phrases = {
        greetings: [
            { chinese: '你好', pinyin: 'Nǐ hǎo', english: 'Hello' },
            { chinese: '早上好', pinyin: 'Zǎoshang hǎo', english: 'Good morning' },
            { chinese: '晚上好', pinyin: 'Wǎnshàng hǎo', english: 'Good evening' },
            { chinese: '再见', pinyin: 'Zàijiàn', english: 'Goodbye' },
            { chinese: '谢谢', pinyin: 'Xièxiè', english: 'Thank you' },
            { chinese: '不客气', pinyin: 'Bú kèqì', english: "You're welcome" },
            { chinese: '对不起', pinyin: 'Duìbùqǐ', english: 'Sorry' },
            { chinese: '没关系', pinyin: 'Méi guānxi', english: "It's okay" }
        ],
        numbers: [
            { chinese: '一', pinyin: 'Yī', english: 'One' },
            { chinese: '二', pinyin: 'Èr', english: 'Two' },
            { chinese: '三', pinyin: 'Sān', english: 'Three' },
            { chinese: '四', pinyin: 'Sì', english: 'Four' },
            { chinese: '五', pinyin: 'Wǔ', english: 'Five' },
            { chinese: '六', pinyin: 'Liù', english: 'Six' },
            { chinese: '七', pinyin: 'Qī', english: 'Seven' },
            { chinese: '八', pinyin: 'Bā', english: 'Eight' },
            { chinese: '九', pinyin: 'Jiǔ', english: 'Nine' },
            { chinese: '十', pinyin: 'Shí', english: 'Ten' }
        ],
        food: [
            { chinese: '米饭', pinyin: 'Mǐfàn', english: 'Rice' },
            { chinese: '面条', pinyin: 'Miàntiáo', english: 'Noodles' },
            { chinese: '茶', pinyin: 'Chá', english: 'Tea' },
            { chinese: '咖啡', pinyin: 'Kāfēi', english: 'Coffee' },
            { chinese: '水', pinyin: 'Shuǐ', english: 'Water' },
            { chinese: '啤酒', pinyin: 'Píjiǔ', english: 'Beer' },
            { chinese: '菜单', pinyin: 'Càidān', english: 'Menu' },
            { chinese: '饺子', pinyin: 'Jiǎozi', english: 'Dumplings' }
        ],
        travel: [
            { chinese: '机场', pinyin: 'Jīchǎng', english: 'Airport' },
            { chinese: '火车站', pinyin: 'Huǒchē zhàn', english: 'Train station' },
            { chinese: '旅馆', pinyin: 'Lǚguǎn', english: 'Hotel' },
            { chinese: '护照', pinyin: 'Hùzhào', english: 'Passport' },
            { chinese: '行李', pinyin: 'Xínglǐ', english: 'Luggage' },
            { chinese: '票', pinyin: 'Piào', english: 'Ticket' },
            { chinese: '出租车', pinyin: 'Chūzū chē', english: 'Taxi' }
        ],
        shopping: [
            { chinese: '多少钱', pinyin: 'Duōshǎo qián', english: 'How much?' },
            { chinese: '太贵了', pinyin: 'Tài guì le', english: 'Too expensive' },
            { chinese: '便宜点', pinyin: 'Piányi diǎn', english: 'Cheaper please' },
            { chinese: '我要这个', pinyin: 'Wǒ yào zhège', english: 'I want this' },
            { chinese: '现金', pinyin: 'Xiànjīn', english: 'Cash' },
            { chinese: '信用卡', pinyin: 'Xìnyòng kǎ', english: 'Credit card' }
        ],
        directions: [
            { chinese: '左边', pinyin: 'Zuǒbiān', english: 'Left' },
            { chinese: '右边', pinyin: 'Yòubiān', english: 'Right' },
            { chinese: '前面', pinyin: 'Qiánmiàn', english: 'In front' },
            { chinese: '后面', pinyin: 'Hòumiàn', english: 'Behind' },
            { chinese: '这里', pinyin: 'Zhèlǐ', english: 'Here' },
            { chinese: '那里', pinyin: 'Nàlǐ', english: 'There' },
            { chinese: '远', pinyin: 'Yuǎn', english: 'Far' },
            { chinese: '近', pinyin: 'Jìn', english: 'Near' }
        ]
    };

    // Initialize
    initCategories();
    setupEventListeners();

    // Functions
    function initCategories() {
        categoryGrid.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.dataset.id = category.id;
            card.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
            `;
            categoryGrid.appendChild(card);
        });
    }

    function showPhrases(categoryId) {
        currentCategory = categoryId;
        const category = categories.find(c => c.id === categoryId);
        currentCategoryTitle.textContent = category.name;
        
        phraseList.innerHTML = '';
        phrases[categoryId].forEach(phrase => {
            const item = document.createElement('div');
            item.className = 'phrase-item';
            item.dataset.chinese = phrase.chinese;
            item.dataset.pinyin = phrase.pinyin;
            item.dataset.english = phrase.english;
            item.innerHTML = `
                <div class="phrase-chinese">${phrase.chinese}</div>
                <div class="phrase-pinyin">${phrase.pinyin}</div>
                <div class="phrase-english">${phrase.english}</div>
            `;
            phraseList.appendChild(item);
        });

        categoriesSection.classList.add('hidden');
        phrasesSection.classList.remove('hidden');
    }

    function setupEventListeners() {
        // Tab switching
        categoryBtn.addEventListener('click', () => {
            categoryBtn.classList.add('active');
            quizBtn.classList.remove('active');
            categoriesSection.classList.remove('hidden');
            phrasesSection.classList.add('hidden');
            quizSection.classList.add('hidden');
        });

        quizBtn.addEventListener('click', () => {
            categoryBtn.classList.remove('active');
            quizBtn.classList.add('active');
            categoriesSection.classList.add('hidden');
            phrasesSection.classList.add('hidden');
            quizSection.classList.remove('hidden');
            startQuiz();
        });

        // Category selection
        categoryGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.category-card');
            if (card) {
                showPhrases(card.dataset.id);
            }
        });

        // Back button
        backToCategoriesBtn.addEventListener('click', () => {
            phrasesSection.classList.add('hidden');
            categoriesSection.classList.remove('hidden');
        });

        // Phrase pronunciation
        phraseList.addEventListener('click', (e) => {
            const item = e.target.closest('.phrase-item');
            if (item) {
                speakPhrase(item.dataset.chinese);
            }
        });

        // Quiz options
        quizOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.quiz-option');
            if (option && !quizFeedback.classList.contains('active')) {
                checkAnswer(option);
            }
        });

        // Next question
        nextQuestionBtn.addEventListener('click', () => {
            quizFeedback.classList.add('hidden');
            quizFeedback.classList.remove('active');
            showNextQuestion();
        });
    }

    function speakPhrase(text) {
        // In a real app, this would use a text-to-speech API with Mandarin support
        console.log(`Speaking: ${text}`);
        // Visual feedback that would normally be accompanied by audio
        const notification = document.createElement('div');
        notification.textContent = "🔊 Speaking...";
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            animation: fadeOut 2s forwards;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function startQuiz() {
        score = 0;
        questionNumber = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        progressFill.style.width = '0%';
        
        // Get all phrases
        quizPhrases = [];
        for (const category in phrases) {
            quizPhrases = [...quizPhrases, ...phrases[category]];
        }
        
        // Shuffle phrases
        quizPhrases = shuffleArray(quizPhrases);
        
        showNextQuestion();
    }

    function showNextQuestion() {
        if (questionNumber >= questionsPerQuiz) {
            endQuiz();
            return;
        }
        
        // Get current question and three random incorrect options
        currentQuizQuestion = quizPhrases[questionNumber];
        let incorrectOptions = quizPhrases
            .filter(p => p.english !== currentQuizQuestion.english)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        // Combine correct and incorrect options and shuffle
        let options = [currentQuizQuestion, ...incorrectOptions];
        options = shuffleArray(options);
        
        // Display question
        quizQuestion.textContent = currentQuizQuestion.chinese;
        
        // Display options
        quizOptions.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.dataset.english = option.english;
            optionElement.textContent = option.english;
            quizOptions.appendChild(optionElement);
        });
        
        questionNumber++;
        progressFill.style.width = `${(questionNumber / questionsPerQuiz) * 100}%`;
    }

    function checkAnswer(optionElement) {
        const selectedAnswer = optionElement.dataset.english;
        const isCorrect = selectedAnswer === currentQuizQuestion.english;
        
        // Highlight correct and incorrect answers
        document.querySelectorAll('.quiz-option').forEach(option => {
            if (option.dataset.english === currentQuizQuestion.english) {
                option.classList.add('correct');
            } else if (option === optionElement) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score and feedback
        if (isCorrect) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            feedbackMessage.textContent = '✓ Correct! ' + currentQuizQuestion.pinyin;
            feedbackMessage.style.color = '#28a745';
        } else {
            feedbackMessage.textContent = '✗ Incorrect. Correct answer: ' + 
                currentQuizQuestion.english + ' (' + currentQuizQuestion.pinyin + ')';
            feedbackMessage.style.color = '#dc3545';
        }
        
        quizFeedback.classList.remove('hidden');
        quizFeedback.classList.add('active');
        
        // Speak the phrase
        speakPhrase(currentQuizQuestion.chinese);
    }

    function endQuiz() {
        quizQuestion.textContent = 'Quiz Complete!';
        quizOptions.innerHTML = '';
        feedbackMessage.textContent = `Your final score: ${score} out of ${questionsPerQuiz}`;
        feedbackMessage.style.color = '#333';
        quizFeedback.classList.remove('hidden');
        nextQuestionBtn.textContent = 'Try Again';
        nextQuestionBtn.addEventListener('click', () => {
            nextQuestionBtn.textContent = 'Next Question';
            startQuiz();
        }, { once: true });
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});

