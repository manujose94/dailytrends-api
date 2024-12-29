export const CONFIGURATION = {
    HOST: __ENV.hasOwnProperty('HOST') ? __ENV.HOST : "http://localhost:3000",
    WAIT_TIME: __ENV.hasOwnProperty('WAIT_TIME') ? parseInt(__ENV.WAIT_TIME) : 300,
    WAIT_TIME_RANDOM: __ENV.hasOwnProperty('WAIT_TIME_RANDOM') ? parseInt(__ENV.WAIT_TIME_RANDOM) : 20,
    AUTHORIZATION: __ENV.hasOwnProperty('AUTHORIZATION') ? __ENV.AUTHORIZATION : "Bearer",
    USER: __ENV.hasOwnProperty('USER') ? __ENV.USER : "",
    PASSWORD: __ENV.hasOwnProperty('PASSWORD') ? __ENV.PASSWORD : "",
    JWT_TOKEN: __ENV.hasOwnProperty('JWT_TOKEN') ? __ENV.JWT_TOKEN : ""
}

  export const PATH_WEIGHT = {
    "getNews": __ENV.hasOwnProperty('PATH_WEIGHT_1') ? parseFloat(__ENV.PATH_WEIGHT_1) : 0.6,
    "registerUser": __ENV.hasOwnProperty('PATH_WEIGHT_2') ? parseFloat(__ENV.PATH_WEIGHT_2) : 0.2,
    "loginUser": __ENV.hasOwnProperty('PATH_WEIGHT_3') ? parseFloat(__ENV.PATH_WEIGHT_3) : 0.2
};