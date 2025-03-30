const USER_SETTINGS_SELECTOR = "#user-custom-settings";
const USER_COLORS_SELECTOR = "#user-colors";
const TIME_SELECTOR = "#time";
const MAX_SIZE_SELECTOR = "#maximum-size";
const MIN_SIZE_SELECTOR = "#minimum-size";
const FIGURE_SELECTOR = "#square";
const LETTER_SELECTOR = '#letter';
const DEFAULT_SEQUENCE_COLOR = '0123456789ABCDEF';
const DEFAULT_SEQUENCE_LETTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_MIN = 10;
const DEFAULT_MAX = 150;
const DEFAULT_TIME = 1000;
const MAXIMUM_TIME = 10000;


/**
 * Получение рандомного цвета
 * @returns {string} Рандомный цвет в HEX коде
*/
function getRandomColor() {
    let sequence = getValueOrDefault(USER_COLORS_SELECTOR, DEFAULT_SEQUENCE_COLOR);

    if (sequence == DEFAULT_SEQUENCE_COLOR) {
        return generateRandomColor(sequence);
    }
    sequence = sequence.split(' ');
    return getRandomValueFromSequence(sequence);
}

/**
 * Получение рандомного значения из последовательности
 * {number} sequence - последовательность
 * @returns {string} Рандомное значение из последовательности
*/
function getRandomValueFromSequence(sequence) {
    return sequence[Math.floor(Math.random() * sequence.length)]
}

/**
 * Генерация рандомного цвета
 * {number} sequence - последовательность
 * @returns {string} Рандомный цвет в HEX коде
*/
function generateRandomColor(sequence) {
    let color = '#';

    for(let i=0; i < 6; i++) {
        color += getRandomValueFromSequence(sequence)
    }

    return color;
}

/**
 * Получить случайную букву
 * @returns {string} Случайная буква
*/
function getRandomLetter() {
    return getRandomValueFromSequence(DEFAULT_SEQUENCE_LETTER);
}

/**
 * Получение рандомного значения размера
 * @returns {number} Размер
*/
function getRandomSize() {
    let minimum = getMinimumValueForLetter();
    let maximum = getMaximumValueForLetter();
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
}

/**
 * Получение минимального значения
 * @returns {number} Значение
*/
function getMinimumValueForLetter() {
    return Number(getValueOrDefault(MIN_SIZE_SELECTOR, DEFAULT_MIN))
}

/**
 * Получение макимального значения
 * @returns {number} Значение
*/
function getMaximumValueForLetter() {
    return Number(getValueOrDefault(MAX_SIZE_SELECTOR, DEFAULT_MAX))
}

/**
 * Получение времени интервала (периодичность анимации)
 * @returns {number} Время
*/
function getTime() {
    let result = Number(getValueOrDefault(TIME_SELECTOR, DEFAULT_TIME));
    return result == DEFAULT_TIME ? result : result * 1000;
}

/**
 * Получение значения со страницы или дефолтное
 * {string} selector - Селектор со значением
 * {string} defaultValue - Дефолтное значение
 * @returns {string} Значение
*/
function getValueOrDefault(selector, defaultValue) {
    const valueFromHtml = document.querySelector(selector).value;
    return valueFromHtml === '' ? defaultValue : valueFromHtml;
}

/**
 * Валидация цветов
 * @returns {bool} Состояние готовности
*/
function validateColors() {
    const userColors = document.querySelector(USER_COLORS_SELECTOR).value;
    if (userColors === '') {
        return true;
    }

    if (userColors.split(" ").length > 20) {
        alert('Не больше 20 цветов!');
        return false;
    }
    for (const color of userColors.split(" ")) {
        if (color.length != 7) {
            alert('Цвет не в формате HEX!');
            return false;
        }
        for (let i = 0; i < 7; i++) {
            if (DEFAULT_SEQUENCE_COLOR.indexOf(color[i].toUpperCase()) == -1 && color[i] != '#') {
                alert('Цвет не в формате HEX!!!');
                return false;
            }
        }
    }
    return true;
}

/**
 * Валидация размеров
 * @returns {bool} Состояние готовности
*/
function validateSize() {
    let minimumSize = document.querySelector(MIN_SIZE_SELECTOR).value;
    let maximumSize = document.querySelector(MAX_SIZE_SELECTOR).value;
    if (minimumSize === '' || maximumSize === '') {
        return true;
    }

    minimumSize = Number(minimumSize);
    maximumSize = Number(maximumSize);
    if (minimumSize < DEFAULT_MIN || maximumSize < DEFAULT_MIN) {
        alert(`Не меньше ${DEFAULT_MIN}!`);
        return false;
    }
    if (minimumSize > DEFAULT_MAX || maximumSize > DEFAULT_MAX) {
        alert(`Не больше ${DEFAULT_MAX}!`);
        return false;
    }
    if (minimumSize > maximumSize) {
        alert(`Минимальное значение больше максимального!`);
        return false;
    }
    return true;
}

/**
 * Валидация времени
 * @returns {bool} Состояние готовности
*/
function validateTime() {
    let time = document.querySelector(TIME_SELECTOR).value;
    if (time === '') {
        return true;
    }
    time = Number(time) * 1000;
    if (time % 1000 != 0) {
        alert(`Не корректное число!`);
        return false;
    }
    if (time < DEFAULT_TIME) {
        alert(`Не меньше ${DEFAULT_TIME / 1000}!`);
        return false;
    }
    if (time > MAXIMUM_TIME) {
        alert(`Не больше ${MAXIMUM_TIME / 1000}!`);
        return false;
    }
    return true;
}

/**
 * Подготовка к старту анимации
 * @returns {void} Состояние готовности
*/
function start() {
    if (!validateColors()) {
        return false;
    }
    if (!validateSize()) {
        return false;
    }
    if (!validateTime()) {
        return false;
    }

    let settings = document.querySelector(USER_SETTINGS_SELECTOR);
    settings.style.display = "none";
    return true;
}

/**
 * Запуск
 * @returns {void}
*/
document.querySelector("#start").addEventListener('click', function () {
    let startState = start();
    if (!startState) {
        return;
    }

    /**
     * JQuery Для Анимаций
     * @returns {void}
    */
    $(document).ready(function () {
        const $square = $(FIGURE_SELECTOR);

        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const squareWidth = $square.width();
        const squareHeight = $square.height();

        const fieldWidth = (viewportWidth - squareWidth) / 2;
        const fieldHeight = (viewportWidth - squareWidth) / 2;
        /**
         * Получение значения со страницы или дефолтное
         * @returns {void}
        */
        function changeState() {
            let letterSize = getRandomSize();
            let letterColor = getRandomColor();
            $(LETTER_SELECTOR)
            $square
                .css('color', `${letterColor}`)
                .animate({
                    fontSize: `${letterSize}px`
                }, {
                    duration: 300,
                    queue: false
            });
        }

        /**
         * Анимация перемещения фигуры
         * @returns {void}
        */
        function randomMove() {
            let left = Math.random() * fieldWidth;
            let top = Math.random() * fieldHeight;
            $square.animate({
                left: left,
                top: top,
            }, {
                duration: 2000,
                easing: 'linear',
                complete: randomMove,
                queue: false
            });
        }

        /**
        * Изменение состояния по времени
        * @returns {void}
        */
        function changeLetter() {
            let randomLetter = getRandomLetter();
            $square.text(`${randomLetter}`)
            setTimeout(changeLetter, getTime());
        }

        randomMove();
        changeLetter();

        $(FIGURE_SELECTOR)
            /**
            * Изменение состояния при нажатии
            * @returns {void}
            */
            .click(function() {
                changeState();
        });
    });
});