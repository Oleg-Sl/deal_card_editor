export const SMART_FIELDS = {
    TITLE:                  "ufCrm21_1695643438",  // Название
    COUNT_PIECES:           "ufCrm21_1694680127",  // Кол-во шт.
    TECHNOLOGY:             "ufCrm21_1694680011",  // Технология изготовления
    FILM:                   "ufCrm21_1694679978",  // Пленка
    LAMINATION:             "ufCrm21_1694680039",  // Ламинация
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

export const LIST_TECHNOLOGY = [
    {ID: 0, VALUE: "печать"},
    {ID: 1, VALUE: "плоттерная резка"},
    {ID: 2, VALUE: "печать+контурная резка"},
];
// список пленок
export const LIST_FILMS = [
    {ID: 0, VALUE: "ORAJET 3640"},
    {ID: 1, VALUE: "ORAJET 3551"},
    {ID: 2, VALUE: "ORAJET 3551RA"},
    {ID: 3, VALUE: "Китай 010"},
    {ID: 4, VALUE: "ORACAL 551"},
    {ID: 5, VALUE: "ORACAL 551G"},
    {ID: 6, VALUE: "ORACAL 551M"},
    {ID: 7, VALUE: "ORACAL 641"},
    {ID: 8, VALUE: "ORACAL 641G"},
    {ID: 9, VALUE: "ORACAL 641M"},
    {ID: 10, VALUE: "Другое (указать в комментариях)"},
];
// список ламинаций
export const LIST_LAMINATIONS = {
    // ORAJET 3640
    "0": [
        {ID: 0, VALUE: "ORAJET 3640 G"},
        {ID: 1, VALUE: "ORAJET 3640 M"},
        {ID: 2, VALUE: "нет"},
    ],
    // ORAJET 3551
    "1": [
        {ID: 0, VALUE: "ORAGARD 215 G"},
        {ID: 1, VALUE: "ORAGARD 215 M"},
        {ID: 2, VALUE: "нет"},
    ],
    // ORAJET 3551RA
    "2": [
        {ID: 0, VALUE: "ORAGARD 215 G"},
        {ID: 1, VALUE: "ORAGARD 215 M"},
        {ID: 2, VALUE: "нет"},
    ],
    // Китай 010
    "3": [
        {ID: 0, VALUE: "Китай G"},
        {ID: 1, VALUE: "Китай М"},
        {ID: 2, VALUE: "нет"},
    ],
    "4": [
        {ID: 0, VALUE: "201"},
        {ID: 1, VALUE: "022"},
        {ID: 2, VALUE: "202"},
        {ID: 3, VALUE: "021"},
        {ID: 4, VALUE: "203"},
        {ID: 5, VALUE: "019"},
        {ID: 6, VALUE: "229"},
        {ID: 7, VALUE: "204"},
        {ID: 8, VALUE: "020"},
        {ID: 9, VALUE: "215"},
        {ID: 10, VALUE: "395"},
        {ID: 11, VALUE: "301"},
        {ID: 12, VALUE: "035"},
        {ID: 13, VALUE: "034"},
        {ID: 14, VALUE: "396"},
        {ID: 15, VALUE: "302"},
        {ID: 16, VALUE: "303"},
        {ID: 17, VALUE: "032"},
        {ID: 18, VALUE: "397"},
        {ID: 19, VALUE: "304"},
        {ID: 20, VALUE: "337"},
        {ID: 21, VALUE: "321"},
        {ID: 22, VALUE: "027"},
        {ID: 23, VALUE: "028"},
        {ID: 24, VALUE: "031"},
        {ID: 25, VALUE: "305"},
        {ID: 26, VALUE: "398"},
        {ID: 27, VALUE: "306"},
        {ID: 28, VALUE: "320"},
        {ID: 29, VALUE: "307"},
        {ID: 30, VALUE: "308"},
        {ID: 31, VALUE: "431"},
        {ID: 32, VALUE: "411"},
        {ID: 33, VALUE: "402"},
        {ID: 34, VALUE: "403"},
        {ID: 35, VALUE: "043"},
        {ID: 36, VALUE: "601"},
        {ID: 37, VALUE: "602"},
        {ID: 38, VALUE: "491"},
        {ID: 39, VALUE: "603"},
        {ID: 40, VALUE: "604"},
        {ID: 41, VALUE: "061"},
        {ID: 42, VALUE: "490"},
        {ID: 43, VALUE: "078"},
        {ID: 44, VALUE: "605"},
        {ID: 45, VALUE: "060"},
        {ID: 46, VALUE: "489"},
        {ID: 47, VALUE: "502"},
        {ID: 48, VALUE: "503"},
        {ID: 49, VALUE: "608"},
        {ID: 50, VALUE: "169"},
        {ID: 51, VALUE: "168"},
        {ID: 52, VALUE: "504"},
        {ID: 53, VALUE: "505"},
        {ID: 54, VALUE: "167"},
        {ID: 55, VALUE: "506"},
        {ID: 56, VALUE: "052"},
        {ID: 57, VALUE: "507"},
        {ID: 58, VALUE: "166"},
        {ID: 59, VALUE: "508"},
        {ID: 60, VALUE: "509"},
        {ID: 61, VALUE: "057"},
        {ID: 62, VALUE: "165"},
        {ID: 63, VALUE: "534"},
        {ID: 64, VALUE: "150"},
        {ID: 65, VALUE: "510"},
        {ID: 66, VALUE: "535"},
        {ID: 67, VALUE: "049"},
        {ID: 68, VALUE: "065"},
        {ID: 69, VALUE: "511"},
        {ID: 70, VALUE: "164"},
        {ID: 71, VALUE: "050"},
        {ID: 72, VALUE: "512"},
        {ID: 73, VALUE: "513"},
        {ID: 74, VALUE: "801"},
        {ID: 75, VALUE: "802"},
        {ID: 76, VALUE: "803"},
        {ID: 77, VALUE: "813"},
        {ID: 78, VALUE: "841"},
        {ID: 79, VALUE: "804"},
        {ID: 80, VALUE: "840"},
        {ID: 81, VALUE: "072"},
        {ID: 82, VALUE: "711"},
        {ID: 83, VALUE: "755"},
        {ID: 84, VALUE: "712"},
        {ID: 85, VALUE: "756"},
        {ID: 86, VALUE: "076"},
        {ID: 87, VALUE: "757"},
        {ID: 88, VALUE: "713"},
        {ID: 89, VALUE: "073"},
        {ID: 90, VALUE: "714"},
        {ID: 91, VALUE: "701"},
        {ID: 92, VALUE: "702"},
        {ID: 93, VALUE: "101"},
        {ID: 94, VALUE: "010"},
        {ID: 95, VALUE: "102"},
        {ID: 96, VALUE: "093"},
        {ID: 97, VALUE: "090"},
        {ID: 98, VALUE: "930"},
        {ID: 99, VALUE: "000"},
    ],
    "5": [
    ],
    "6": [
    ],
    "7": [
    ],
    "8": [
    ],
    "9": [
    ],
    "10": [
        {ID: 0, VALUE: "ORAJET 3640 G"},
        {ID: 1, VALUE: "ORAJET 3640 M"},
        {ID: 2, VALUE: "ORAGARD 215 G"},
        {ID: 3, VALUE: "ORAGARD 215 M"},
        {ID: 4, VALUE: "Китай G"},
        {ID: 5, VALUE: "Китай М"},
        {ID: 6, VALUE: "нет"},
    ],
};
// export const LIST_LAMINATIONS = [
//     {ID: 0, VALUE: "ORAJET 3640 G"},
//     {ID: 1, VALUE: "ORAJET 3640 M"},
//     {ID: 2, VALUE: "ORAGARD 215 G"},
//     {ID: 3, VALUE: "ORAGARD 215 M"},
//     {ID: 4, VALUE: "Китай G"},
//     {ID: 5, VALUE: "Китай M"},
//     {ID: 6, VALUE: "нет"},
// ];

export const LIST_WIDTH_FILMS = {
    "0": [
        {ID: 0, VALUE: "1"},
        {ID: 1, VALUE: "1,05"},
        {ID: 2, VALUE: "1,26"},
        {ID: 3, VALUE: "1,37"},
        {ID: 4, VALUE: "1,52"},
        {ID: 5, VALUE: "1,6"},
    ],
    "1": [
        {ID: 0, VALUE: "1,26"},
        {ID: 1, VALUE: "1,37"},
    ],
    "2": [],
    "3": [
        {ID: 0, VALUE: "1,07"},
        {ID: 1, VALUE: "1,27"},
        {ID: 2, VALUE: "1,37"},
        {ID: 3, VALUE: "1,52"},
    ],
    "4": [
        {ID: 0, VALUE: "1"},
        {ID: 1, VALUE: "1,26"},
    ],
    "5": [
        {ID: 0, VALUE: "1,26"},
    ],
    "6": []
};
export const LIST_COUNT_SIDES = [
    {ID: 0, VALUE: 1},
    {ID: 1, VALUE: 2},
];

