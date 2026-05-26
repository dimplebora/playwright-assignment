// cucumber.js

module.exports = {
  default: {
    
    require: [
      'features/support/*.js',
      'features/step-definitions/*.js'
    ],

    format: [
      'progress',
      'html:test-results/cucumber-report.html'
    ],

    publishQuiet: true,

    parallel: 1
  }
};
