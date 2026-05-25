module.exports = {

    default: {

        require: [

            'step-definitions/*.js'
        ],

        format: ['progress'],

        paths: ['features/*.feature']
    }
};