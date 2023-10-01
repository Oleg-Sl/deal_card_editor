// Бизнес процессы
export const BIZPROC_CREATE_TASK = 177;

// Поля в сделке
export const FIELD_TITLE               = "TITLE";                   // Название сделки
export const FIELD_RESPONSIBLE_MOP     = "ASSIGNED_BY_ID";          // Ответственный МОП
export const FIELD_RESPONSIBLE_MOS     = "UF_CRM_1672839295";       // Ответственный МОС
export const FIELD_OBSERVERS           = "UF_CRM_1684305731";       // Список наблюдателей задачи "ЗАКАЗ"
export const FIELD_ID_TASK_ORDER       = "UF_CRM_1661089895";       // ID задачи "ЗАКАЗ" (сохраненное в сделке)
export const FIELD_ID_TASK_PRODUCTION  = "UF_CRM_1661089717";       // ID задачи "ПРОИЗВОДСТВО" (сохраненное в сделке)
export const FIELD_DESC_ORDER          = "UF_CRM_1655918107";       // Что делаем по заказу в целом
export const FIELD_BUSINESS_TRIP       = "UF_CRM_1668129559";       // Командировка
export const FIELD_METERING            = "UF_CRM_1695664525";       // Замер
export const FIELD_DISMANTLING         = "UF_CRM_1657651541";       // Демонтаж
export const FIELD_PARKING             = "UF_CRM_1637861351";       // Парковка
export const FIELD_COLOR_PROOF         = "UF_CRM_1640199620";       // Печать согласно ЦП?
export const FIELD_INSTALL             = "UF_CRM_1637861029";       // Монтаж 24/7
export const FIELD_OURDETAILS          = "UF_CRM_1637326777";       // Наши реквизиты
export const FIELD_BOXING_RENTAL       = "UF_CRM_1694710116";       // Аренда бокса
export const FIELD_INSTALL_ON_TERRIT   = "UF_CRM_1694710578";       // Монтаж на территории
export const FIELD_CONTACT_MESURE      = "UF_CRM_1621943311";       // Контакт для Замера
export const FIELD_NUMBER_ORDER        = "UF_CRM_1633523035";       // № заказа (автоматически)
export const FIELD_LINK_TENDER         = "UF_CRM_1620918041";       // Ссылка  рабочую таблицу / тендер / CRM Клиента


// Поля в смартпроцессе
export const SMART_FIELDS = {
    ID:                     "id",                  // Идентификатор
    TITLE:                  "ufCrm21_1695643438",  // Название
    COUNT_PIECES:           "ufCrm21_1694680127",  // Кол-во шт.
    TECHNOLOGY:             "ufCrm21_1694680011",  // Технология изготовления
    FILM:                   "ufCrm21_1694679978",  // Пленка
    LAMINATION:             "ufCrm21_1695660066",  // Ламинация
    WIDTH_FILM:             "ufCrm21_1694680085",  // Ширина пленки
    LINEAR_METER_PIECES:    "ufCrm21_1694680054",  // П.м. за шт.
    SQUARE_METER_PIECES:    "ufCrm21_1694680115",  // Кв. м. за шт.
    LINEAR_METER_TOTAL:     "ufCrm21_1694680100",  // П.м. всего
    SQUARE_METER_TOTAL:     "ufCrm21_1694680155",  // Кв.м. всего
    LINK_SRC:               "ufCrm21_1694680292",  // Ссылка на исходники клиента
    CLIENT_FILES:           "ufCrm21_1694680404",  // Файлы клиента
    PREPRESS:               "ufCrm21_1695644086",  // Черновой препресс
    COMMENT:                "ufCrm21_1694680324",  // Комментарии
};


// export const LIST_IGNORE_CHECK_FIELDS_DEAL = [];
export const LIST_IGNORE_CHECK_FIELDS_DEAL = [FIELD_LINK_TENDER, FIELD_OBSERVERS,];
export const LIST_IGNORE_CHECK_FIELDS_PRODUCTS = [SMART_FIELDS.LINK_SRC , SMART_FIELDS.CLIENT_FILES, SMART_FIELDS.COMMENT,];

// список технологий изготовления
export const LIST_TECHNOLOGY = [
    {ID: 1, VALUE: "печать"},
    {ID: 2, VALUE: "плоттерная резка"},
    {ID: 3, VALUE: "печать+контурная резка"},
    {ID: 4, VALUE: "без производства"},
    {ID: 5, VALUE: "другое"},
];

// список пленок
export const LIST_FILMS = [
    {ID: 1, VALUE: "ORAJET 3640"},
    {ID: 2, VALUE: "ORAJET 3551"},
    {ID: 3, VALUE: "ORAJET 3551RA"},
    {ID: 4, VALUE: "Китай 010"},
    {ID: 6, VALUE: "ORACAL 551G"},
    {ID: 7, VALUE: "ORACAL 551M"},
    {ID: 9, VALUE: "ORACAL 641G"},
    {ID: 10, VALUE: "ORACAL 641M"},
    {ID: 11, VALUE: "Другое (указать в комментариях)"},
];

// список ламинаций
export const LIST_LAMINATIONS = {
    "1": [
        "ORAJET 3640 G", "ORAJET 3640 M", "нет"
    ],
    "2": [
        "ORAGARD 215 G", "ORAGARD 215 M", "нет"
    ],
    "3": [
        "ORAGARD 215 G", "ORAGARD 215 M", "нет"
    ],
    "4": [
        "Китай G", "Китай М", "нет"
    ],
    "6": [
        "201", "022", "202", "021", "203", "019", "229", "204", "020", "215", "395", "301", "035", "034", "396", "302", "303", "032", "397", "304", "337", "321", "027", "028", "031", "305", "398", "306", "320", "307", "308", "431", "411", "402", "403", "043", "601", "602", "491", "603", "604", "061", "490", "078", "605", "060", "489", "502", "503", "608", "169", "168", "504", "505", "167", "506", "052", "507", "166", "508", "509", "057", "165", "534", "150", "510", "535", "049", "065", "511", "164", "050", "512", "513", "801", "802", "803", "813", "841", "804", "840", "072", "711", "755", "712", "756", "076", "757", "713", "073", "714", "701", "702", "101", "010", "102", "093", "090", "930", "000"
    ],
    "7": [
        "201", "022", "202", "021", "203", "019", "229", "204", "020", "215", "395", "301", "035", "034", "396", "302", "303", "032", "397", "304", "337", "321", "027", "028", "031", "305", "398", "306", "320", "307", "308", "431", "411", "402", "403", "043", "601", "602", "491", "603", "604", "061", "490", "078", "605", "060", "489", "502", "503", "608", "169", "168", "504", "505", "167", "506", "052", "507", "166", "508", "509", "057", "165", "534", "150", "510", "535", "049", "065", "511", "164", "050", "512", "513", "801", "802", "803", "813", "841", "804", "840", "072", "711", "755", "712", "756", "076", "757", "713", "073", "714", "701", "702", "101", "010", "102", "093", "090", "930", "000"
    ],
    "9": [
        "000", "010", "020", "019", "021", "022", "025", "312", "030", "031", "032", "047", "034", "036", "035", "404", "040", "043", "042", "041", "045", "562", "518", "050", "065", "049", "086", "067", "057", "051", "098", "052", "084", "053", "056", "066", "054", "055", "060", "613", "061", "068", "062", "064", "063", "800", "083", "081", "082", "023", "070", "073", "071", "076", "074", "072", "090", "091", "092"
    ],
    "10": [
        "000", "010", "020", "019", "021", "022", "025", "312", "030", "031", "032", "047", "034", "036", "035", "404", "040", "043", "042", "041", "045", "562", "518", "050", "065", "049", "086", "067", "057", "051", "098", "052", "084", "053", "056", "066", "054", "055", "060", "613", "061", "068", "062", "064", "063", "800", "083", "081", "082", "023", "070", "073", "071", "076", "074", "072", "090", "091", "092"
    ],
    "11": [
        {ID: 0, VALUE: "ORAJET 3640 G"},
        {ID: 1, VALUE: "ORAJET 3640 M"},
        {ID: 2, VALUE: "ORAGARD 215 G"},
        {ID: 3, VALUE: "ORAGARD 215 M"},
        {ID: 4, VALUE: "Китай G"},
        {ID: 5, VALUE: "Китай М"},
        {ID: 6, VALUE: "нет"},
    ],
};

// список ширин пленок
export const LIST_WIDTH_FILMS = {
    "1": [
        {ID: 1, VALUE: "1"},
        {ID: 2, VALUE: "1,05"},
        {ID: 3, VALUE: "1,26"},
        {ID: 4, VALUE: "1,37"},
        {ID: 5, VALUE: "1,52"},
        {ID: 6, VALUE: "1,6"},
    ],
    "2": [
        {ID: 1, VALUE: "1,26"},
        {ID: 2, VALUE: "1,37"},
    ],
    "3": [
        {ID: 1, VALUE: "-"},
    ],
    "4": [
        {ID: 1, VALUE: "1,07"},
        {ID: 2, VALUE: "1,27"},
        {ID: 3, VALUE: "1,37"},
        {ID: 4, VALUE: "1,52"},
    ],
    "6": [
        {ID: 1, VALUE: "1,26"},
    ],
    "7": [
        {ID: 1, VALUE: "1,26"},
    ],
    "9": [
        {ID: 1, VALUE: "1"},
        {ID: 2, VALUE: "1,26"},
    ],
    "10": [
        {ID: 1, VALUE: "1"},
        {ID: 2, VALUE: "1,26"},
    ],
    "11": [
        {ID: 1, VALUE: "-"},
    ]
};
