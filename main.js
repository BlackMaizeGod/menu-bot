const TelegramBot = require('node-telegram-bot-api');
const token = '883002059:AAGaGjaEXh1MNK6MUt9KPJ7d6o-C2ZM6eWE';
const bot = new TelegramBot(token, {polling: true});

let tables={
    trueTables:[],
    falseTables:[],
    selectedTable: 0,
    active: false
};
let clientInfo = {
    name:'',
    phone:'',
    selectedItem:'',
    makeYourself:[],
    order:[]
};
const waiterId = '505926819';
const adminId = '455045670';
let fullPrice = 0;
let price = 0;
let lastPrice = 0;
let i = 0;

const allMenuButtons=[
    {
        title: `Дякуємо за реєстрацію, По натисненню відповідної кнопки ви отримаєте меню,
також є можливість замовити столик на який принесуть замовлення,
кількість натискань на кнопку з певним продуктом відповідає за кількість цього продукту в корзині,
зробіть замовлення як будете готові \uD83D\uDE0A`,
        inline_keyboard: [
            [
                {text: '\uD83D\uDC49 Отримати меню \uD83D\uDC48', callback_data: 'Отримати меню'}
            ],
            [
                {text: '\uD83C\uDF55 Маргарита ціна: 60грн', callback_data: 'Маргарита/60'},
                {text: '\uD83C\uDF70 "Нью-Йорк" ціна: 23грн', callback_data: 'Чізкейк "Нью-Йорк"/23'},
                {text: '\uD83C\uDF7A Пиво Старопрамен ціна: 26грн', callback_data: 'Пиво Старопрамен/26'}
            ],
            [
                {text: '\uD83C\uDF55 Супрем ціна: 80грн', callback_data: 'Супрем/80'},
                {text: '\uD83C\uDF70 Тірамісу ціна: 28грн', callback_data: 'Тірамісу/28'},
                {text: '\uD83C\uDF7A Пиво Львівське 1715 ціна: 18грн', callback_data: 'Пиво Львівське 1715/18'}
            ],
            [
                {text: '\uD83C\uDF55 Селянська ціна: 70грн', callback_data: 'Селянська/70'},
                {text: '\uD83C\uDF70 Торт "Прага" ціна: 32грн', callback_data: 'Торт "Прага"/32'},
                {text: '\uD83C\uDF7A Пиво Стелла Артуа ціна: 37грн', callback_data: 'Пиво Стелла Артуа/37'}
            ],
            [
                {text: '\uD83C\uDF55 Пепперони ціна: 60грн', callback_data: 'Пепперони/60'},
                {text: '\uD83C\uDF70 Торт "Медовик" ціна: 26грн', callback_data: 'Торт "Медовик"26'},
                {text: '\uD83C\uDF76 Боржомі ціна: 40грн', callback_data: 'Боржомі/40'}
            ],
            [
                {text: '\uD83C\uDF55 Куатро Формаджи ціна: 80грн', callback_data: 'Куатро Формаджи/80'},
                {text: '\uD83C\uDF70 Торт "Чорний ліс" ціна: 42грн', callback_data: 'Торт "Чорний ліс"/42'},
                {text: '\uD83C\uDF76 Моршинська ціна: 35грн', callback_data: 'Моршинська/35'}
            ],
            [
                {text: '\uD83C\uDF55 Кальцоне ціна: 80грн', callback_data: 'Кальцоне/80'},
                {text: '\uD83C\uDF70 Торт "Моцарт" ціна: 38грн', callback_data: 'Торт "Моцарт"/38'},
                {text: '\uD83C\uDF76 Бонаква 0.5л ціна: 14грн', callback_data: 'Бонаква 0.5л/14'}
            ],
            [
                {text: '\uD83C\uDF55 Тірольска ціна: 80грн', callback_data: 'Тірольска/80'},
                {text: '\uD83C\uDF70 "Зимня вишня" ціна: 27грн', callback_data: 'Торт "Зимня вишня"/27'},
                {text: '\uD83C\uDF76 Бонаква 1л ціна: 16грн', callback_data: 'Бонаква 1л/16'}
            ],
            [
                {text: '\uD83C\uDF55 Грибна з беконом ціна: 60грн', callback_data: 'Грибна з беконом/60'},
                {text: '\uD83C\uDF70 Млинець з нутеллой ціна: 24грн', callback_data: 'Млинець з нутеллой/24'},
                {text: '\uD83C\uDF79 Сік Грейпфрутовий ціна: 50грн', callback_data: 'Сік Грейпфрутовий/50'}
            ],
            [
                {text: '\uD83C\uDF55 Капрічоса ціна: 120грн', callback_data: 'Капрічоса/120'},
                {text: '\uD83C\uDF6EКекс "Маффин" ціна: 8грн', callback_data: 'Кекс "Маффин"/8'},
                {text: '\uD83C\uDF79 Сік Апельсиновий ціна: 48грн', callback_data: 'Сік Апельсиновий/48'}
            ],
            [
                {text: '\uD83C\uDF55 Клубна ціна: 120грн', callback_data: 'Клубна/120'},
                {text: '\uD83C\uDF67 Морозиво з шоколадом ціна: 14грн', callback_data: 'Морозиво з шоколадом/14'},
                {text: '\uD83C\uDF79 Сік Яблучний ціна: 35грн', callback_data: 'Сік Яблучний/35'}
            ],
            [
                {text: '\uD83C\uDF55 Зроби сам ціна: 80грн', callback_data: 'Зроби-сам-кнопка/80'},
                {text: '\uD83C\uDF67 Морозиво пломбір ціна: 14грн', callback_data: 'Морозиво пломбір/14'},
                {text: '\uD83C\uDF79 Сік Морковний ціна: 30грн', callback_data: 'Сік Морковний/30'}
            ],
            [
                {text: "\u2705 Підтвердити", callback_data: 'accept'},
                {text: '\u2796 останній', callback_data: 'reject'},
                {text: '\uD83D\uDC47 Показати', callback_data: 'show'}
            ],
            [
                {text:"\uD83C\uDC04 Вибрати столик \uD83C\uDC04",callback_data:'tables'}
            ]
        ]
    }
];
const adminMenu = [
    {
        title: 'Редагування активності столиків',
        inline_keyboard: [
            [
                {text: "Вибрати активні", callback_data: 'active'},
                {text: "Вибрати неактивні", callback_data: 'nonactive'}
            ]
        ]
    }
];
const makeYourselfIngredients = [
    {
        title: 'Меню створення власної піцци',
        inline_keyboard: [
            [
                {text: "гриби", callback_data: 'Зроби-сам_гриби'},
                {text: "сир", callback_data: 'Зроби-сам_сир'},
                {text: "бекон", callback_data: 'Зроби-сам_бекон'}
            ],
            [
                {text: "курка", callback_data:'Зроби-сам_курка'},
                {text: "зелень", callback_data:'Зроби-сам_зелень'},
                {text: "ананаси", callback_data:'Зроби-сам_ананаси'}
            ],
            [
                {text: "оливки", callback_data:'Зроби-сам_оливки'},
                {text: "помідори", callback_data:'Зроби-сам_мар. огірки'},
                {text: "мар. огірки", callback_data:'Зроби-сам_мар. огірки'}
            ],
            [
                {text: "\u2705 Створити піццу", callback_data:'Зроби-сам_Створити піццу'},
                {text: "\u2796 останній", callback_data:'Зроби-сам_останній'},
                {text: "\uD83D\uDC47 Показати", callback_data:'Зроби-сам_Показати'}
            ]
        ]

    }
];
const tableList = [
    {
        title: 'Список столиків',
        inline_keyboard: [
            [
                {text: "1", callback_data: 'table_1'},
                {text: "2", callback_data: 'table_2'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "3", callback_data:'table_3'},
                {text: "4", callback_data: 'table_4'}
            ],
            [
                {text: "12", callback_data: 'table_12'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "5", callback_data: 'table_5'}
            ],
            [
                {text: "11", callback_data: 'table_11'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "6", callback_data: 'table_6'}
            ],
            [
                {text: "10", callback_data: 'table_10'},
                {text: "9", callback_data: 'table_9'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "\uD83C\uDC04", callback_data:'test'},
                {text: "8", callback_data:'table_8'},
                {text: "7", callback_data: 'table_7'}
            ]
        ]
    }
];
const photoOfMenu=[
    {
        type: "photo",
        media:
            "img/pizza.png"
    },
    {
        type: "photo",
        media:
            "img/desert.png"
    },
    {
        type: "photo",
        media:
            "img/drink.png"
    },

];

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId === parseInt(adminId)){
        show(chatId, tableList[0]);
        show(chatId,adminMenu[0]);
    }else {
        bot.sendMessage(chatId, "Вас вітає піцерія 'IT-pizza', для початку зареєструйтесь, " +
            "відправте одним повідомленням Ім'я та номер телефону через пробіл");
    }
});
bot.on('message',  (msg) => {
    const chatId = msg.from.id;
    clientInfo.name = msg.text.split(' ')[0];
    clientInfo.phone = msg.text.split(' ')[1];
    if(clientInfo.name != undefined && clientInfo.phone != undefined
       && clientInfo.name != '' && clientInfo.phone != '') {
        show(chatId, allMenuButtons[0]);
   }else if(chatId != adminId) {
        bot.sendMessage(chatId, "Введіть ім'я та номер телефон через пробел");
    }
});
bot.on('callback_query',function (msg) {
    const chatId = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    let buttonValue = msg.data.split('/')[0];
    price = parseInt(msg.data.split('/')[1]);
    (isNaN(price) == false) ? lastPrice = price: lastPrice = lastPrice;
    let firstPart = buttonValue.split('_')[0];
    let secondPart = buttonValue.split('_')[1];
    if(buttonValue!= 'test') {
        if (clientInfo.name == '' || clientInfo.phone == '' && chatId != adminId ) {
            bot.sendMessage(chatId,'Зареєструйтесь будь-ласка');
        }else{
            if (msg.data == 'active') {
                tables.active = true;
            }
            if (msg.data == 'nonactive') {
                tables.active = false;
            }
            if (chatId == adminId && secondPart) {
                if (tables.trueTables.indexOf(secondPart) == -1
                    && tables.falseTables.indexOf(secondPart) == -1) {
                    if (tables.active == true) {
                        tables.trueTables.push(secondPart + '');
                        bot.answerCallbackQuery(msg.id,`Активні столики: ${tables.trueTables} 
Неактивні столики: ${tables.falseTables} `);
                    } else {
                        tables.falseTables.push(secondPart + '');
                        bot.answerCallbackQuery(msg.id,`Активні столики: ${tables.trueTables} 
Неактивні столики: ${tables.falseTables} `);
                    }
                } else if (tables.falseTables.indexOf(secondPart) > -1 && tables.active == true) {
                    tables.falseTables.splice(tables.falseTables.indexOf(secondPart), 1);
                    tables.trueTables.push(secondPart + '');
                    bot.answerCallbackQuery(msg.id,`Активні столики: ${tables.trueTables} 
Неактивні столики: ${tables.falseTables} `);
                } else if (tables.trueTables.indexOf(secondPart) > -1 && tables.active == false) {
                    tables.trueTables.splice(tables.trueTables.indexOf(secondPart), 1);
                    tables.falseTables.push(secondPart + '');
                    bot.answerCallbackQuery(msg.id,`Активні столики: ${tables.trueTables} 
Неактивні столики: ${tables.falseTables} `);
                }
            } else {
                if (buttonValue != 'accept' && firstPart != 'Зроби-сам'
                    && buttonValue != 'show' && buttonValue != 'reject'
                    && buttonValue != 'Зроби-сам-кнопка' && buttonValue != 'Отримати меню'
                    && buttonValue != 'tables' && firstPart != 'table'
                    && clientInfo.name != '' && clientInfo.phone != ''
                    && buttonValue != 'active' && buttonValue != 'nonactive') {
                    if(clientInfo.order.indexOf(buttonValue) == -1) {
                        pushItemToOrder(clientInfo.order, buttonValue);
                        fullPrice += price;
                    }else if(clientInfo.order.indexOf(buttonValue) > -1){
                        bot.answerCallbackQuery(msg.id, showAlertValue(clientInfo.order,buttonValue)+1);
                        pushItemToOrder(clientInfo.order, buttonValue);
                        fullPrice += price;
                    }
                } else if (buttonValue == 'Отримати меню') {
                    bot.sendMediaGroup(chatId, photoOfMenu);
                } else if (buttonValue == 'Зроби-сам-кнопка') {
                    show(chatId, makeYourselfIngredients[0]);
                    fullPrice += price;
                } else if (firstPart == 'Зроби-сам') {
                    if (secondPart != 'Показати' && secondPart != 'останній' && secondPart != 'Створити піццу') {
                        if(clientInfo.makeYourself.indexOf(secondPart) == -1) {
                            clientInfo.makeYourself.push(secondPart);
                        }else{
                            bot.answerCallbackQuery(msg.id, showAlertValue(clientInfo.makeYourself,secondPart)+1);
                            clientInfo.makeYourself.push(secondPart);
                        }
                    } else {
                        if (secondPart == 'останній') {
                            clientInfo.makeYourself.pop();
                        }
                        if (secondPart == 'Показати') {
                            bot.sendMessage(chatId, `Ваша піцца: ${clientInfo.makeYourself}`);
                        }
                        if (secondPart == 'Створити піццу') {
                            clientInfo.order.push(`[Зроби сам: ${clientInfo.makeYourself}]`);
                        }

                    }
                } else if (buttonValue == 'tables' && chatId != adminId) {
                    show(chatId, tableList[0]);
                } else if (firstPart == 'table' && chatId != adminId) {
                    tables.selectedTable = parseInt(secondPart);
                    if (tables.falseTables.indexOf(tables.selectedTable + '') == -1 && chatId != adminId) {
                        clientInfo.order.push(`[Клієнт забронював ${tables.selectedTable} столик]`);
                        let index = tables.trueTables.indexOf(tables.selectedTable + '');
                        tables.falseTables.push(tables.selectedTable + '');
                        if(index !== -1){
                            tables.trueTables.splice(index,1);
                            bot.answerCallbackQuery(msg.id, {text: `Данний столик зайнятий, виберіть один з цих: ${tables.trueTables}`});
                        }
                    }else if(tables.falseTables.indexOf(tables.selectedTable + '') > -1 && chatId != adminId){
                        bot.answerCallbackQuery(msg.id, {text: `Данний столик зайнятий, виберіть один з цих: ${tables.trueTables}`});
                    }
                } else {
                    if (buttonValue == 'reject' && i<2) {
                        clientInfo.order.pop();
                        fullPrice -= lastPrice;
                        i = 2;
                    }
                    if (buttonValue == 'show') {
                        bot.sendMessage(chatId, `Ваше замовлення: ${clientInfo.order} Загальна ціна: ${fullPrice}`);
                    }
                    if (buttonValue == 'accept' && clientInfo.order.length != 0
                        && clientInfo.name != undefined && clientInfo.phone != undefined
                        && clientInfo.name != '' && clientInfo.phone != '') {
                        bot.sendMessage(waiterId, `Клієнт ${clientInfo.name}, номер телефону ${clientInfo.phone},
замовив: ${clientInfo.order} Загальна вартість: ${fullPrice}`);
                        clientInfo.order.splice(0, clientInfo.order.length);
                        clientInfo.makeYourself.splice(0, clientInfo.makeYourself.length);
                        clientInfo.name = clientInfo.phone = '';
                        price = i= fullPrice = lastPrice = 0;
                    }else if (chatId != adminId) {
                        bot.sendMessage('Зареєструйтесь будь-ласка');
                    }
                }
            }
        }
    }
    bot.answerCallbackQuery(msg.id);
});

function pushItemToOrder(array, item) {
    array.push(item);
}
function show(chatId,object){
    let text = object.title;
    let options = {
        reply_markup: JSON.stringify({
            inline_keyboard: object.inline_keyboard,
            parse_mode: 'Markdown'
        })
    };
    bot.sendMessage(chatId, text, options);
}
function showAlertValue(array,item){
    return array.filter(x => x === item).length;
}

