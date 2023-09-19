export const SMART_FIELDS = {
    TECHNOLOGY:    "ufCrm21_1694680011",  // Технология изготовления
    FILM:          "ufCrm21_1694679978",  // Пленка
    LAMINATION:    "ufCrm21_1694680039",  // Ламинация
    WIDTH_FILM:    "ufCrm21_1694680085",  // Ширина пленки
    LINEAR_METER:  "ufCrm21_1694680054",  // П.м.
    LENGTH_AREA:   "ufCrm21_1694680115",  // Длина, м
    HEIGHT_AREA:   "ufCrm21_1694680100",  // Высота, м
    COUNT_SIDE:    "ufCrm21_1694680138",  // Кол-во бортов
    COUNT_CARS:    "ufCrm21_1694680127",  // Кол-во авто
    SQUARE_METERS: "ufCrm21_1694680155",  // Кв.м. монтажа
    LINK_SRC:      "ufCrm21_1694680292",  // Ссылка на исходники клиента
    COMMENT:       "ufCrm21_1694680324",  // Комментарии
    CLIENT_FILES:  "ufCrm21_1694680404"   // Файлы клиента
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
    {ID: 2, VALUE: "Китай 010"},
    {ID: 3, VALUE: "ORACAL 641"},
    {ID: 4, VALUE: "ORACAL 551"},
    {ID: 5, VALUE: "ORAJET 3551RA"},
    {ID: 6, VALUE: "Другое (указать в комментариях)"},
];
// список ламинаций
export const LIST_LAMINATIONS = {
    "0": [
        {ID: 0, VALUE: "ORAJET 3640 G"},
        {ID: 1, VALUE: "ORAJET 3640 M"},
        {ID: 2, VALUE: "нет"},
    ],
    "1": [
        {ID: 0, VALUE: "ORAGARD 215 G"},
        {ID: 1, VALUE: "ORAGARD 215 M"},
        {ID: 2, VALUE: "нет"},
    ],
    "2": [
        {ID: 0, VALUE: "Китай G"},
        {ID: 1, VALUE: "Китай М"},
        {ID: 2, VALUE: "нет"},
    ],
    "3": [
    ],
    "4": [
    ],
    "5": [
        {ID: 0, VALUE: "ORAGARD 215 G"},
        {ID: 1, VALUE: "ORAGARD 215 M"},
        {ID: 2, VALUE: "нет"},
    ],
    "6": [
        {ID: 0, VALUE: "ORAJET 3640 G"},
        {ID: 0, VALUE: "ORAJET 3640 M"},
        {ID: 0, VALUE: "ORAGARD 215 G"},
        {ID: 0, VALUE: "ORAGARD 215 M"},
        {ID: 0, VALUE: "Китай G"},
        {ID: 0, VALUE: "Китай М"},
        {ID: 0, VALUE: "нет"},
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
    "2": [
        {ID: 0, VALUE: "1,07"},
        {ID: 1, VALUE: "1,27"},
        {ID: 2, VALUE: "1,37"},
        {ID: 3, VALUE: "1,52"},
    ],
    "3": [
        {ID: 0, VALUE: "1"},
        {ID: 1, VALUE: "1,26"},
    ],
    "4": [
        {ID: 0, VALUE: "1,26"},
    ],
    "5": [],
    "6": []
};
export const LIST_COUNT_SIDES = [
    {ID: 0, VALUE: 1},
    {ID: 1, VALUE: 2},
];

